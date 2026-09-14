import "server-only";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export interface ProductFilter {
  search?: string;
  brand?: string;
  category?: string;
  function?: string;
  certification?: string;
  packaging?: string;
  productType?: string;
  moq?: string;
  market?: string;
  sort?: string;
}

const productInclude = {
  brand: true,
  images: true,
  certifications: { include: { certification: true } },
  functions: { include: { function: true } },
} satisfies Prisma.ProductInclude;

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

export async function getProducts(filters: ProductFilter = {}) {
  const where: Prisma.ProductWhereInput = { status: "PUBLISHED" };

  if (filters.brand) {
    where.brand = { slug: filters.brand };
  }
  if (filters.category) {
    where.functions = {
      some: { function: { category: { slug: filters.category } } },
    };
  }
  if (filters.function) {
    where.functions = {
      some: { function: { slug: filters.function } },
    };
  }
  if (filters.certification) {
    where.certifications = {
      some: { certification: { slug: filters.certification } },
    };
  }
  if (filters.packaging) {
    where.packaging = { contains: filters.packaging };
  }
  if (filters.productType) {
    where.productType = filters.productType;
  }
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { shortDescription: { contains: filters.search, mode: "insensitive" } },
      { ingredients: { contains: filters.search, mode: "insensitive" } },
      { brand: { name: { contains: filters.search, mode: "insensitive" } } },
      {
        functions: {
          some: { function: { name: { contains: filters.search, mode: "insensitive" } } },
        },
      },
      {
        certifications: {
          some: { certification: { name: { contains: filters.search, mode: "insensitive" } } },
        },
      },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];
  switch (filters.sort) {
    case "newest":
      orderBy = [{ createdAt: "desc" }];
      break;
    case "popular":
      orderBy = [{ isBestseller: "desc" }, { sortOrder: "asc" }];
      break;
    case "name":
      orderBy = [{ name: "asc" }];
      break;
    case "brand":
      orderBy = [{ brand: { name: "asc" } }];
      break;
    case "featured":
    default:
      orderBy = [{ isFeatured: "desc" }, { sortOrder: "asc" }];
      break;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy,
    }),
    prisma.product.count({ where }),
  ]);

  return { products: products as ProductWithRelations[], total };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      images: { orderBy: { sortOrder: "asc" } },
      certifications: { include: { certification: true } },
      functions: { include: { function: true } },
      documents: true,
    },
  });
}

export async function getRelatedProducts(
  productId: string,
  functionSlugs: string[],
  brandId?: string
) {
  let where: Prisma.ProductWhereInput = {
    id: { not: productId },
    status: "PUBLISHED",
    OR: [
      brandId ? { brandId } : {},
      { functions: { some: { function: { slug: { in: functionSlugs } } } } },
    ].filter((o) => Object.keys(o).length > 0),
  };

  if (where.OR && (where.OR as any[]).length === 0) {
    delete where.OR;
  }

  const products = await prisma.product.findMany({
    where,
    include: productInclude,
    take: 4,
  });
  return products as ProductWithRelations[];
}
