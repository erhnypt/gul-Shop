import { ProductGrid, toProductCardData } from "@/components/products/product-grid";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getFunctionBySlug } from "@/server/queries";
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
  const fn = await getFunctionBySlug(slug);
  if (!fn) return {};
  return { title: fn.name, description: fn.description ?? undefined };
}

export default async function FunctionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const fn = await getFunctionBySlug(slug);
  if (!fn) notFound();
  const t = await getDictionary(locale);
  const { products } = await getProducts({ function: slug, sort: "featured" });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Breadcrumbs
          locale={locale}
          items={[{ label: t["functions.title"], href: `/${locale}/products` }, { label: fn.name }]}
        />
      </div>
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-light text-foreground lg:text-4xl">
          {fn.name}
        </h1>
        {fn.description && (
          <p className="mt-3 max-w-2xl text-foreground-muted">{fn.description}</p>
        )}
        <p className="mt-2 text-sm text-foreground-subtle">
          {products.length} {t["common.products"]}
        </p>
      </div>
      <ProductGrid products={products.map(toProductCardData)} columns={4} />
    </div>
  );
}
