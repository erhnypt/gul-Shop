import { ProductGrid, toProductCardData } from "@/components/products/product-grid";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { getBrandBySlug } from "@/server/queries";
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
  const brand = await getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: brand.name,
    description: brand.description ?? undefined,
  };
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();
  const t = await getDictionary(locale);
  trackEvent("BRAND_VIEW", { brandSlug: brand.slug, locale });

  const publishedProducts = brand.products;

  const allCerts = Array.from(
    new Map(
      publishedProducts.flatMap((p) =>
        p.certifications.map((c) => [c.certification.slug, c.certification])
      )
    ).values()
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Breadcrumbs
          locale={locale}
          items={[{ label: t["brands.title"], href: `/${locale}/brands` }, { label: brand.name }]}
        />
      </div>

      {/* Brand header */}
      <div className="mb-10 flex flex-col items-start gap-6 border-b border-border pb-10 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center border border-border bg-surface">
          {brand.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logoUrl} alt={brand.name} className="h-16 w-auto object-contain" />
          ) : (
            <span className="font-serif text-3xl font-semibold text-foreground">
              {brand.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground lg:text-4xl">
            {brand.name}
          </h1>
          {brand.country && (
            <p className="mt-1 text-sm text-foreground-subtle">{brand.country}</p>
          )}
          {brand.website && (
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-accent hover:underline"
            >
              {brand.website}
            </a>
          )}
        </div>
      </div>

      {/* Brand story */}
      {brand.description && (
        <div className="mb-10 max-w-3xl">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
            Brand Story
          </h2>
          <p className="text-base leading-relaxed text-foreground-muted">{brand.description}</p>
        </div>
      )}

      {/* Certifications */}
      {allCerts.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
            {t["common.certifications"]}
          </h2>
          <div className="flex flex-wrap gap-2">
            {allCerts.map((c) => (
              <Badge key={c.id} variant="outline">
                {c.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-light text-foreground">
          {brand.name} {t["common.products"]} ({publishedProducts.length})
        </h2>
      </div>
      {publishedProducts.length > 0 ? (
        <ProductGrid products={publishedProducts.map(toProductCardData)} columns={4} />
      ) : (
        <p className="text-foreground-muted">{t["search.noResults"]}</p>
      )}
    </div>
  );
}
