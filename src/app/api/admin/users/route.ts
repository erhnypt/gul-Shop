import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

const roles = ["ADMIN", "SUPER_ADMIN", "SALES", "VIEWER"] as const;

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().optional().nullable(),
  password: z.string().min(6),
  role: z.enum(roles).default("ADMIN"),
});

const patchSchema = z.object({
  id: z.string(),
  role: z.enum(roles).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(6).optional(),
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
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const d = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: d.email } });
  if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

  const passwordHash = await bcrypt.hash(d.password, 10);
  try {
    const created = await prisma.user.create({
      data: { email: d.email, name: d.name, passwordHash, role: d.role },
    });
    await prisma.auditLog.create({ data: { userId: user.id, action: "USER_CREATED", entity: "User", entityId: created.id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const d = parsed.data;

  const data: { role?: (typeof roles)[number]; isActive?: boolean; passwordHash?: string } = {};
  if (d.role) data.role = d.role;
  if (d.isActive !== undefined) data.isActive = d.isActive;
  if (d.password) data.passwordHash = await bcrypt.hash(d.password, 10);

  try {
    await prisma.user.update({ where: { id: d.id }, data });
    await prisma.auditLog.create({ data: { userId: user.id, action: "USER_EDITED", entity: "User", entityId: d.id } });
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
  if (id === user.id) return NextResponse.json({ error: "You cannot delete yourself" }, { status: 400 });

  try {
    await prisma.user.delete({ where: { id } });
    await prisma.auditLog.create({ data: { userId: user.id, action: "USER_DELETED", entity: "User", entityId: id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
