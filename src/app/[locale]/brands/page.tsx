import { BrandCard } from "@/components/brands/brand-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getDictionary } from "@/lib/i18n";
import { getBrands } from "@/server/queries";

export default async function BrandsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, brands] = await Promise.all([getDictionary(locale), getBrands()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Breadcrumbs locale={locale} items={[{ label: t["brands.title"] }]} />
      </div>
      <div className="mb-10 text-center">
        <h1 className="font-serif text-3xl font-light text-foreground lg:text-4xl">
          {t["brands.title"]}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-foreground-muted">
          {t["brands.subtitle"]}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => (
          <BrandCard
            key={b.id}
            brand={{
              name: b.name,
              slug: b.slug,
              logoUrl: b.logoUrl,
              description: b.description,
              country: b.country,
              productCount: b._count.products,
            }}
          />
        ))}
      </div>
    </div>
  );
}
