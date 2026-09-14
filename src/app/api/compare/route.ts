import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const slugsParam = req.nextUrl.searchParams.get("slugs") ?? "";
  const slugs = slugsParam.split(",").map((s) => s.trim()).filter(Boolean);
  if (slugs.length === 0) return NextResponse.json({ products: [] });

  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, status: "PUBLISHED" },
    include: {
      brand: { select: { name: true, slug: true } },
      certifications: { include: { certification: { select: { id: true, name: true, slug: true } } } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
  });

  const mapped = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand.name,
    productType: p.productType,
    packaging: p.packaging,
    size: p.size,
    moq: p.moq,
    moqNote: p.moqNote,
    shelfLife: p.shelfLife,
    leadTime: p.leadTime,
    availability: p.availability,
    sampleAvailable: p.sampleAvailable,
    oemOdmAvailable: p.oemOdmAvailable,
    benefits: p.benefits,
    image: p.images[0]?.url ?? null,
    certifications: p.certifications.map((c) => c.certification.name),
  }));

  return NextResponse.json({ products: mapped });
}