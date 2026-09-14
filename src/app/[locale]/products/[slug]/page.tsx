import { ProductDetailClient } from "@/components/products/product-detail-client";
import { ProductGrid, toProductCardData } from "@/components/products/product-grid";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getRelatedProducts, getProductBySlug } from "@/server/product-queries";
import { getSiteSettings } from "@/server/queries";
import { trackEvent } from "@/lib/analytics";
import { getDictionary } from "@/lib/i18n";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "PUBLISHED") return {};
  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.shortDescription ?? undefined,
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? undefined,
      images: product.images?.[0]?.url ?? undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.status !== "PUBLISHED") {
    notFound();
  }

  const t = await getDictionary(locale);
  const settings = await getSiteSettings();

  trackEvent("PRODUCT_VIEW", { productSlug: product.slug, locale });

  const related = await getRelatedProducts(
    product.id,
    product.functions.map((f) => f.function.slug),
    product.brandId
  );

  const data = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    productType: product.productType,
    shortDescription: product.shortDescription,
    description: product.description,
    benefits: product.benefits,
    ingredients: product.ingredients,
    skinType: product.skinType,
    packaging: product.packaging,
    size: product.size,
    moq: product.moq,
    moqNote: product.moqNote,
    cartonQuantity: product.cartonQuantity,
    unitsPerCarton: product.unitsPerCarton,
    shelfLife: product.shelfLife,
    countryOfOrigin: product.countryOfOrigin,
    leadTime: product.leadTime,
    sampleAvailable: product.sampleAvailable,
    oemOdmAvailable: product.oemOdmAvailable,
    brand: product.brand,
    certifications: product.certifications,
    documents: product.documents,
    whatsapp: settings?.whatsappNumber ?? process.env.WHATSAPP_NUMBER ?? null,
    image: product.images?.[0]?.url ?? null,
    images: product.images,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Breadcrumbs
          locale={locale}
          items={[
            { label: t["products.title"], href: `/${locale}/products` },
            { label: product.brand.name, href: `/${locale}/brands/${product.brand.slug}` },
            { label: product.name },
          ]}
        />
      </div>

      <ProductDetailClient product={data as any} />

      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="mb-8 font-serif text-2xl font-light text-foreground lg:text-3xl">
            {t["product.relatedProducts"]}
          </h2>
          <ProductGrid products={related.map(toProductCardData)} columns={4} />
        </section>
      )}
    </div>
  );
}
