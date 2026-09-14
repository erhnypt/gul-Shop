import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const locales = ["en", "th"];

  const staticRoutes = [
    "",
    "/products",
    "/products/compare",
    "/brands",
    "/about",
    "/contact",
    "/export-wholesale",
    "/sachet-skincare",
    "/request-a-quote",
    "/rfq-list",
    "/faq",
    "/markets/uae",
    "/markets/saudi-arabia",
    "/markets/europe",
    "/markets/africa",
  ];

  const pages: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      pages.push({
        url: `${base}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: route === "" ? 1 : 0.7,
        alternates: {
          languages: {
            th: `${base}/th${route}`,
            en: `${base}/en${route}`,
          },
        },
      });
    }
  }

  const [products, brands, functions, certifications] = await Promise.all([
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.brand.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.function.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.certification.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ]);

  for (const locale of locales) {
    for (const p of products) {
      pages.push({
        url: `${base}/${locale}/products/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
    for (const b of brands) {
      pages.push({ url: `${base}/${locale}/brands/${b.slug}`, lastModified: b.updatedAt, changeFrequency: "monthly", priority: 0.6 });
    }
    for (const f of functions) {
      pages.push({ url: `${base}/${locale}/functions/${f.slug}`, changeFrequency: "monthly", priority: 0.5 });
    }
    for (const c of certifications) {
      pages.push({ url: `${base}/${locale}/certifications/${c.slug}`, changeFrequency: "monthly", priority: 0.5 });
    }
  }

  return pages;
}
