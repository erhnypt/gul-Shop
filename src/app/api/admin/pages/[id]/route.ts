import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export interface RouteCtx {
  params: Promise<{ id: string }>;
}

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  content: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDesc: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
});

export async function PATCH(req: NextRequest, { params }: RouteCtx) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  await prisma.page.update({ where: { id }, data: parsed.data });
  await prisma.auditLog.create({ data: { userId: user.id, action: "PAGE_EDITED", entity: "Page", entityId: id } });
  return NextResponse.json({ success: true });
}
