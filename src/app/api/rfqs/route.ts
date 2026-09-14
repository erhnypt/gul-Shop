import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";

const rfqSchema = z.object({
  fullName: z.string().min(2, "Full name required"),
  companyName: z.string().min(2, "Company name required"),
  country: z.string().min(2, "Country required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  preferredContact: z.enum(["email", "whatsapp", "both"]).default("both"),
  quantity: z.number().int().positive().optional().or(z.number().optional()),
  targetPrice: z.string().optional(),
  preferredPackaging: z.string().optional(),
  deliveryDest: z.string().optional(),
  additionalReqs: z.string().optional(),
  message: z.string().optional(),
  rfqNumber: z.string().optional(),
  productId: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive().optional(),
        note: z.string().optional(),
      })
    )
    .optional(),
  gdpr: z.boolean().optional(),
  locale: z.string().optional(),
  // honeypot
  website: z.string().optional(),
});

async function generateRfqNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const count = await prisma.rFQ.count({
    where: { createdAt: { gte: new Date(`${year}-01-01`) } },
  });
  return `RFQ-${year}-${String(count + 1).padStart(6, "0")}`;
}

// Simple in-memory rate limit
const rateLimit = new Map<string, { count: number; reset: number }>();
const LIMIT = 5;
const WINDOW = 60 * 60 * 1000; // 1 hour

export async function POST(req: NextRequest) {
  // Rate limiting by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const now = Date.now();
  const bucket = rateLimit.get(ip);
  if (bucket) {
    if (bucket.reset < now) {
      rateLimit.set(ip, { count: 1, reset: now + WINDOW });
    } else if (bucket.count >= LIMIT) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    } else {
      bucket.count++;
    }
  } else {
    rateLimit.set(ip, { count: 1, reset: now + WINDOW });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = rfqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot
  if (data.website) {
    return NextResponse.json({ success: true, rfqNumber: "HIDDEN" });
  }

  try {
    const rfqNumber = data.rfqNumber || (await generateRfqNumber());

    let productIds = new Set<string>();
    if (data.productId) productIds.add(data.productId);
    (data.items ?? []).forEach((i) => productIds.add(i.productId));

    // Validate product IDs exist
    if (productIds.size > 0) {
      const existing = await prisma.product.findMany({
        where: { id: { in: Array.from(productIds) } },
        select: { id: true },
      });
      const existingIds = new Set(existing.map((p) => p.id));
      const invalid = Array.from(productIds).filter((id) => !existingIds.has(id));
      if (invalid.length > 0) {
        return NextResponse.json(
          { error: "Invalid product reference" },
          { status: 400 }
        );
      }
    }

    const rfq = await prisma.rFQ.create({
      data: {
        rfqNumber,
        fullName: data.fullName,
        companyName: data.companyName,
        country: data.country,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        preferredContact: data.preferredContact,
        targetPrice: data.targetPrice,
        preferredPackaging: data.preferredPackaging,
        deliveryDest: data.deliveryDest,
        additionalReqs: data.additionalReqs,
        message: data.message,
        gdprConsent: data.gdpr ?? false,
        items: {
          create: data.items?.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            note: item.note,
          })),
        },
      },
    });

    // Create lead
    await prisma.lead.create({
      data: {
        source: "rfq",
        companyName: data.companyName,
        contactName: data.fullName,
        email: data.email,
        phone: data.phone ?? data.whatsapp,
        country: data.country,
        internalNotes: `Created from RFQ ${rfqNumber}`,
      },
    });

    // Analytics
    trackEvent("RFQ_SUBMIT", { locale: data.locale });

    // Send emails (non-blocking)
    if (process.env.EMAIL_API_KEY) {
      sendEmails(rfq, data).catch((e) => console.error("Email error:", e));
    }

    return NextResponse.json({ success: true, rfqNumber, id: rfq.id });
  } catch (err: any) {
    console.error("RFQ creation error:", err);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}

async function sendEmails(
  rfq: any,
  data: any
) {
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.EMAIL_API_KEY);

  const salesEmail = process.env.SALES_EMAIL;
  const from = process.env.EMAIL_FROM ?? "noreply@gulshop.com";

  // Business email
  await resend.emails.send({
    from,
    to: salesEmail!,
    subject: `New Wholesale RFQ – ${rfq.rfqNumber}`,
    html: rfqBusinessEmail(rfq, data),
  });

  // Buyer confirmation
  await resend.emails.send({
    from,
    to: data.email,
    subject: "Thank you for your wholesale inquiry",
    html: buyerConfirmationEmail(rfq, data),
  });
}

function rfqBusinessEmail(rfq: any, data: any) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px">
      <h2>New Wholesale RFQ – ${rfq.rfqNumber}</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Date:</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${new Date(rfq.createdAt).toISOString()}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Name:</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${rfq.fullName}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Company:</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${rfq.companyName}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Country:</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${rfq.country}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Email:</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${rfq.email}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Phone:</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${rfq.phone || rfq.whatsapp || "-"}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Destination:</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${rfq.deliveryDest || "-"}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Message:</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${rfq.message || "-"}</td></tr>
      </table>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/rfqs/${rfq.id}" style="display:inline-block;background:#111;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px">View RFQ in Admin</a></p>
    </div>
  `;
}

function buyerConfirmationEmail(rfq: any, data: any) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px">
      <h2>Thank you for your wholesale inquiry</h2>
      <p>Dear ${rfq.fullName},</p>
      <p>We have received your wholesale inquiry. Here are your details:</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>RFQ Number:</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${rfq.rfqNumber}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Company:</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${rfq.companyName}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Product ID:</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${data.productId || "Multiple"}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Quantity:</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${data.quantity || "-"}</td></tr>
      </table>
      <p>A member of our sales team will review your requirements and get back to you.</p>
    </div>
  `;
}
