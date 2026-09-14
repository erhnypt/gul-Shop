import "server-only";
import { cache } from "react";
import prisma from "@/lib/prisma";

export const getSiteSettings = cache(async () => {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });
  return settings;
});

export const getBrands = cache(async () => {
  const brands = await prisma.brand.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
  const counts = await prisma.product.groupBy({
    by: ["brandId"],
    where: { status: "PUBLISHED" },
    _count: { _all: true },
  });
  const countMap = new Map(counts.map((c) => [c.brandId, c._count._all]));
  return brands.map((b) => ({
    ...b,
    _count: { products: countMap.get(b.id) ?? 0 },
  }));
});

export const getBrandBySlug = cache(async (slug: string) => {
  return prisma.brand.findUnique({
    where: { slug },
    include: {
      products: {
        where: { status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
        include: {
          brand: true,
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          certifications: {
            include: { certification: true },
          },
        },
      },
    },
  });
});

export const getFunctions = cache(async () => {
  const functions = await prisma.function.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
  const counts = await prisma.productFunction.groupBy({
    by: ["functionId"],
    where: { product: { status: "PUBLISHED" } },
    _count: { _all: true },
  });
  const countMap = new Map(counts.map((c) => [c.functionId, c._count._all]));
  return functions.map((f) => ({
    ...f,
    _count: { products: countMap.get(f.id) ?? 0 },
  }));
});

export const getFunctionBySlug = cache(async (slug: string) => {
  return prisma.function.findUnique({
    where: { slug },
    include: {
      products: {
        where: { product: { status: "PUBLISHED" } },
        include: { product: true },
      },
    },
  });
});

export const getCertifications = cache(async () => {
  return prisma.certification.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
});

export const getCertificationBySlug = cache(async (slug: string) => {
  return prisma.certification.findUnique({
    where: { slug },
    include: {
      products: {
        where: { product: { status: "PUBLISHED" } },
        include: { product: true },
      },
    },
  });
});

export const getHeroSlides = cache(async () => {
  return prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 3,
  });
});

export const getFaqs = cache(async () => {
  return prisma.fAQ.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
});

export const getTestimonials = cache(async () => {
  return prisma.testimonial.findMany({
    where: { isActive: true, isVerified: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
  });
});

export const getPageBySlug = cache(async (slug: string) => {
  return prisma.page.findUnique({
    where: { slug },
    include: { translations: true },
  });
});

export const getPages = cache(async () => {
  return prisma.page.findMany({
    orderBy: { createdAt: "desc" },
  });
});

export const getFeaturedProducts = cache(async () => {
  return prisma.product.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    orderBy: { sortOrder: "asc" },
    take: 8,
    include: {
      brand: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      certifications: { include: { certification: true } },
    },
  });
});

export const getSachetProducts = cache(async () => {
  return prisma.product.findMany({
    where: { status: "PUBLISHED", isSachet: true },
    orderBy: { sortOrder: "asc" },
    take: 8,
    include: {
      brand: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      certifications: { include: { certification: true } },
    },
  });
});
