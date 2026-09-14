import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

const schema = z.object({
  id: z.string().optional(),
  question: z.string().min(2),
  answer: z.string().min(2),
  sortOrder: z.number().int().default(0),
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

  try {
    if (d.id) {
      await prisma.fAQ.update({ where: { id: d.id }, data: { question: d.question, answer: d.answer, sortOrder: d.sortOrder, isPublished: d.isPublished } });
      await prisma.auditLog.create({ data: { userId: user.id, action: "FAQ_EDITED", entity: "FAQ", entityId: d.id } });
    } else {
      const created = await prisma.fAQ.create({
        data: { question: d.question, answer: d.answer, sortOrder: d.sortOrder, isPublished: d.isPublished },
      });
      await prisma.auditLog.create({ data: { userId: user.id, action: "FAQ_CREATED", entity: "FAQ", entityId: created.id } });
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
    await prisma.fAQ.delete({ where: { id } });
    await prisma.auditLog.create({ data: { userId: user.id, action: "FAQ_DELETED", entity: "FAQ", entityId: id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}