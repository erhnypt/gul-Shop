import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  role: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  quote: z.string().min(5),
  rating: z.number().int().min(1).max(5).default(5),
  isVerified: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
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
      await prisma.testimonial.update({
        where: { id: d.id },
        data: {
          name: d.name,
          role: d.role,
          companyName: d.companyName,
          country: d.country,
          quote: d.quote,
          rating: d.rating,
          isVerified: d.isVerified,
          sortOrder: d.sortOrder,
          isActive: d.isActive,
        },
      });
      await prisma.auditLog.create({ data: { userId: user.id, action: "TESTIMONIAL_EDITED", entity: "Testimonial", entityId: d.id } });
    } else {
      const created = await prisma.testimonial.create({
        data: {
          name: d.name,
          role: d.role,
          companyName: d.companyName,
          country: d.country,
          quote: d.quote,
          rating: d.rating,
          isVerified: d.isVerified,
          sortOrder: d.sortOrder,
          isActive: d.isActive,
        },
      });
      await prisma.auditLog.create({ data: { userId: user.id, action: "TESTIMONIAL_CREATED", entity: "Testimonial", entityId: created.id } });
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
    await prisma.testimonial.delete({ where: { id } });
    await prisma.auditLog.create({ data: { userId: user.id, action: "TESTIMONIAL_DELETED", entity: "Testimonial", entityId: id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}