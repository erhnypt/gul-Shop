import { AdminProductForm } from "@/components/admin/admin-product-form";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, brands, functions, certifications] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { functions: true, certifications: true, documents: true },
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.function.findMany({ orderBy: { name: "asc" } }),
    prisma.certification.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const data = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brandId: product.brandId,
    sku: product.sku,
    shortDescription: product.shortDescription,
    description: product.description,
    benefits: product.benefits,
    ingredients: product.ingredients,
    skinType: product.skinType,
    productType: product.productType,
    packaging: product.packaging,
    size: product.size,
    countryOfOrigin: product.countryOfOrigin,
    moq: product.moq,
    moqNote: product.moqNote,
    cartonQuantity: product.cartonQuantity,
    unitsPerCarton: product.unitsPerCarton,
    shelfLife: product.shelfLife,
    leadTime: product.leadTime,
    sampleAvailable: product.sampleAvailable,
    oemOdmAvailable: product.oemOdmAvailable,
    isFeatured: product.isFeatured,
    isSachet: product.isSachet,
    isNew: product.isNew,
    isBestseller: product.isBestseller,
    isExportReady: product.isExportReady,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    status: product.status,
    availability: product.availability,
    functionIds: product.functions.map((f) => f.functionId),
    certificationIds: product.certifications.map((c) => c.certificationId),
    documents: product.documents.map((d) => ({
      id: d.id,
      name: d.name,
      url: d.url,
      type: d.type,
      access: d.access as any,
    })),
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/admin/products" className="text-sm text-accent hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 font-serif text-2xl font-light text-foreground">Edit Product</h1>
      </div>
      <AdminProductForm
        product={data as any}
        brands={brands.map((b) => ({ id: b.id, name: b.name, slug: b.slug }))}
        functions={functions.map((f) => ({ id: f.id, name: f.name, slug: f.slug }))}
        certifications={certifications.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
      />
    </div>
  );
}
