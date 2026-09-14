import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  brandId: z.string(),
  sku: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  benefits: z.string().optional().nullable(),
  ingredients: z.string().optional().nullable(),
  skinType: z.string().optional().nullable(),
  productType: z.string().optional().nullable(),
  packaging: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  countryOfOrigin: z.string().optional().nullable(),
  moq: z.number().int().positive().optional().nullable(),
  moqNote: z.string().optional().nullable(),
  cartonQuantity: z.number().int().optional().nullable(),
  unitsPerCarton: z.number().int().optional().nullable(),
  shelfLife: z.string().optional().nullable(),
  leadTime: z.string().optional().nullable(),
  sampleAvailable: z.boolean().default(false),
  oemOdmAvailable: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isSachet: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isExportReady: z.boolean().default(true),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  availability: z.enum(["AVAILABLE", "LIMITED", "ON_REQUEST", "UNAVAILABLE"]).default("AVAILABLE"),
  functionIds: z.array(z.string()).default([]),
  certificationIds: z.array(z.string()).default([]),
  documents: z
    .array(
      z.object({
        name: z.string().min(1),
        url: z.string().min(1),
        type: z.string().default("specification"),
        access: z.enum(["public", "after_rfq", "admin_only"]).default("public"),
      })
    )
    .default([]),
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

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  const data = {
    name: d.name,
    slug: d.slug,
    brandId: d.brandId,
    sku: d.sku,
    shortDescription: d.shortDescription,
    description: d.description,
    benefits: d.benefits,
    ingredients: d.ingredients,
    skinType: d.skinType,
    productType: d.productType,
    packaging: d.packaging,
    size: d.size,
    countryOfOrigin: d.countryOfOrigin ?? undefined,
    moq: d.moq,
    moqNote: d.moqNote,
    cartonQuantity: d.cartonQuantity,
    unitsPerCarton: d.unitsPerCarton,
    shelfLife: d.shelfLife,
    leadTime: d.leadTime,
    sampleAvailable: d.sampleAvailable,
    oemOdmAvailable: d.oemOdmAvailable,
    isFeatured: d.isFeatured,
    isSachet: d.isSachet,
    isNew: d.isNew,
    isBestseller: d.isBestseller,
    isExportReady: d.isExportReady,
    seoTitle: d.seoTitle,
    seoDescription: d.seoDescription,
    status: d.status,
    availability: d.availability,
  };

  try {
    let product;
    if (d.id) {
      product = await prisma.product.update({
        where: { id: d.id },
        data: {
          ...data,
          functions: { deleteMany: {}, create: d.functionIds.map((id) => ({ functionId: id })) },
          certifications: { deleteMany: {}, create: d.certificationIds.map((id) => ({ certificationId: id })) },
          documents: {
            deleteMany: {},
            create: d.documents.map((doc) => ({ name: doc.name, url: doc.url, type: doc.type, access: doc.access })),
          },
        },
      });
      await prisma.auditLog.create({ data: { userId: user.id, action: "PRODUCT_EDITED", entity: "Product", entityId: product.id } });
    } else {
      product = await prisma.product.create({
        data: {
          ...data,
          functions: { create: d.functionIds.map((id) => ({ functionId: id })) },
          certifications: { create: d.certificationIds.map((id) => ({ certificationId: id })) },
          documents: {
            create: d.documents.map((doc) => ({ name: doc.name, url: doc.url, type: doc.type, access: doc.access })),
          },
        },
      });
      await prisma.auditLog.create({ data: { userId: user.id, action: "PRODUCT_CREATED", entity: "Product", entityId: product.id } });
    }
    return NextResponse.json({ success: true, id: product.id });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message ?? "Failed to save product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.product.delete({ where: { id } });
  await prisma.auditLog.create({ data: { userId: user.id, action: "PRODUCT_DELETED", entity: "Product", entityId: id } });
  return NextResponse.json({ success: true });
}
