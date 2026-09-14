import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export interface RouteCtx {
  params: Promise<{ id: string }>;
}

const patchSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUOTATION_SENT", "NEGOTIATION", "WON", "LOST", "ARCHIVED"]).optional(),
  note: z.string().optional(),
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
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const d = parsed.data;

  try {
    if (d.status) {
      await prisma.rFQ.update({ where: { id }, data: { status: d.status } });
      await prisma.auditLog.create({
        data: { userId: user.id, action: "RFQ_STATUS_CHANGED", entity: "RFQ", entityId: id, details: d.status },
      });
    }
    if (d.note) {
      await prisma.rFQNote.create({
        data: { rfqId: id, content: d.note, authorId: user.id, isInternal: true },
      });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
