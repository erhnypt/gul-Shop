import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

const schema = z.object({
  id: z.string().optional(),
  heading: z.string().min(2),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  ctaText: z.string().optional().nullable(),
  ctaLink: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
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

  try {
    if (d.id) {
      await prisma.heroSlide.update({ where: { id: d.id }, data: d });
      await prisma.auditLog.create({ data: { userId: user.id, action: "HERO_SLIDE_EDITED", entity: "HeroSlide", entityId: d.id } });
    } else {
      const created = await prisma.heroSlide.create({ data: d });
      await prisma.auditLog.create({ data: { userId: user.id, action: "HERO_SLIDE_CREATED", entity: "HeroSlide", entityId: created.id } });
    }
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
  try {
    await prisma.heroSlide.delete({ where: { id } });
    await prisma.auditLog.create({ data: { userId: user.id, action: "HERO_SLIDE_DELETED", entity: "HeroSlide", entityId: id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}