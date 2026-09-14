import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

const schema = z.object({
  siteName: z.string().optional(),
  siteDescription: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  salesEmail: z.string().optional().nullable(),
  generalEmail: z.string().optional().nullable(),
  supportEmail: z.string().optional().nullable(),
  whatsappNumber: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  businessHours: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
});

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: parsed.data,
  });
  await prisma.auditLog.create({ data: { userId: user.id, action: "SETTINGS_CHANGED", entity: "SiteSettings" } });
  return NextResponse.json({ success: true });
}
