import { PageHero } from "@/components/ui/page-hero";
import { ProductGrid, toProductCardData } from "@/components/products/product-grid";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/ui/container";
import { getDictionary } from "@/lib/i18n";
import { getSachetProducts } from "@/server/queries";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function SachetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getDictionary(locale);
  const products = await getSachetProducts();

  const advantages = [
    "Lightweight — lower shipping costs",
    "Low shipping volume per unit",
    "Low unit packaging cost",
    "Easy trial distribution",
    "Suitable for impulse retail",
    "Suitable for pharmacies and supermarkets",
    "Suitable for travel retail",
    "Suitable for promotional campaigns",
  ];

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Breadcrumbs locale={locale} items={[{ label: t["sachet.title"] }]} />
      </div>
      <PageHero locale={locale} eyebrowKey="sachet.title" titleKey="sachet.title" subtitleKey="sachet.subtitle" />

      <Container className="py-16">
        {/* Benefits */}
        <section className="mb-16">
          <h2 className="mb-8 text-center font-serif text-2xl font-light text-foreground lg:text-3xl">
            Why Sachet?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map((a, i) => (
              <div key={i} className="border border-border bg-surface/40 p-5">
                <CheckCircle className="mb-3 h-5 w-5 text-accent" />
                <p className="text-sm text-foreground-muted">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured sachet products */}
        <section className="mb-16">
          <h2 className="mb-8 font-serif text-2xl font-light text-foreground lg:text-3xl">
            Featured Sachet Products
          </h2>
          {products.length > 0 ? (
            <ProductGrid products={products.map(toProductCardData)} columns={4} />
          ) : (
            <p className="text-foreground-muted">{t["search.noResults"]}</p>
          )}
        </section>

        {/* CTA */}
        <div className="rounded-lg bg-foreground p-10 text-center">
          <h2 className="font-serif text-2xl font-light text-background lg:text-3xl">
            {t["cta.title"]}
          </h2>
          <Link
            href={`/${locale}/request-a-quote`}
            className="mt-6 inline-flex rounded-md bg-accent px-8 py-3.5 text-sm font-medium text-white hover:bg-accent-dark"
          >
            {t["common.requestWholesaleQuote"]}
          </Link>
        </div>
      </Container>
    </>
  );
}
