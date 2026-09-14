import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string().min(5),
  gdpr: z.boolean().optional(),
  // honeypot
  website: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  try {
    if (process.env.EMAIL_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.EMAIL_API_KEY);
      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "noreply@gulshop.com",
        to: process.env.GENERAL_EMAIL ?? process.env.SALES_EMAIL ?? "sales@gulshop.com",
        subject: `New Contact Enquiry – ${parsed.data.name}`,
        html: `<p><strong>Name:</strong> ${parsed.data.name}</p>
               <p><strong>Email:</strong> ${parsed.data.email}</p>
               <p><strong>Company:</strong> ${parsed.data.company ?? "-"}</p>
               <p><strong>Message:</strong> ${parsed.data.message}</p>`,
      });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
