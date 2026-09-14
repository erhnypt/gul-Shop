import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
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
  const d = parsed.data;
  const slug = d.slug || slugify(d.name);
  try {
    if (d.id) {
      await prisma.certification.update({ where: { id: d.id }, data: { ...d, slug } });
    } else {
      await prisma.certification.create({ data: { ...d, slug } });
    }
    await prisma.auditLog.create({ data: { userId: user.id, action: d.id ? "CERTIFICATION_EDITED" : "CERTIFICATION_CREATED", entity: "Certification" } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.certification.delete({ where: { id } });
  await prisma.auditLog.create({ data: { userId: user.id, action: "CERTIFICATION_DELETED", entity: "Certification" } });
  return NextResponse.json({ success: true });
}
