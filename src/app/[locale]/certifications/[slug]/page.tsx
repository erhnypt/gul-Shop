import { ProductGrid, toProductCardData } from "@/components/products/product-grid";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getCertificationBySlug } from "@/server/queries";
import { getProducts } from "@/server/product-queries";
import { getDictionary } from "@/lib/i18n";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cert = await getCertificationBySlug(slug);
  if (!cert) return {};
  return { title: cert.name, description: cert.description ?? undefined };
}

export default async function CertificationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const cert = await getCertificationBySlug(slug);
  if (!cert) notFound();
  const t = await getDictionary(locale);
  const { products } = await getProducts({ certification: slug, sort: "featured" });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Breadcrumbs
          locale={locale}
          items={[{ label: t["certifications.title"], href: `/${locale}/products` }, { label: cert.name }]}
        />
      </div>
      <div className="mb-10">
        <div className="flex items-center gap-3">
          {cert.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cert.logoUrl} alt={cert.name} className="h-12 w-12 object-contain" />
          )}
          <h1 className="font-serif text-3xl font-light text-foreground lg:text-4xl">
            {cert.name}
          </h1>
        </div>
        {cert.description && (
          <p className="mt-3 max-w-2xl text-foreground-muted">{cert.description}</p>
        )}
        <p className="mt-2 text-sm text-foreground-subtle">
          {products.length} {t["common.products"]}
        </p>
      </div>
      <ProductGrid products={products.map(toProductCardData)} columns={4} />
    </div>
  );
}
