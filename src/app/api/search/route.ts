import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "10", 10), 20);

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [], functions: [], brands: [], certifications: [] });
  }

  trackEvent("SEARCH", { query: q, locale: req.nextUrl.searchParams.get("locale") });

  const [products, functions, brands, certifications] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { shortDescription: { contains: q, mode: "insensitive" } },
          { ingredients: { contains: q, mode: "insensitive" } },
          { brand: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      include: {
        brand: true,
        images: { take: 1 },
      },
      take: limit,
    }),
    prisma.function.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      take: 5,
    }),
    prisma.brand.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      take: 5,
    }),
    prisma.certification.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      take: 5,
    }),
  ]);

  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand.name,
      image: p.images[0]?.url ?? null,
    })),
    functions: functions.map((f) => ({ slug: f.slug, name: f.name })),
    brands: brands.map((b) => ({ slug: b.slug, name: b.name })),
    certifications: certifications.map((c) => ({ slug: c.slug, name: c.name })),
  });
}
