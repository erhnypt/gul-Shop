import { FilterPanel } from "@/components/products/filter-panel";
import { ProductGrid, toProductCardData } from "@/components/products/product-grid";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getDictionary } from "@/lib/i18n";
import {
  getProducts,
  type ProductFilter,
} from "@/server/product-queries";
import {
  getBrands,
  getFunctions,
  getCertifications,
} from "@/server/queries";
import Link from "next/link";
import { SearchX, SlidersHorizontal } from "lucide-react";

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getDictionary(locale);

  const get = (key: string) => {
    const v = sp[key];
    return Array.isArray(v) ? v[0] : (v ?? undefined);
  };

  const filters: ProductFilter = {
    search: get("search"),
    brand: get("brand"),
    category: get("category"),
    function: get("function"),
    certification: get("certification"),
    packaging: get("packaging"),
    productType: get("product_type"),
    sort: get("sort") ?? "featured",
  };

  const [data, brands, functions, certifications] = await Promise.all([
    getProducts(filters),
    getBrands(),
    getFunctions(),
    getCertifications(),
  ]);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "popular", label: "Most Popular" },
    { value: "brand", label: "Brand" },
    { value: "name", label: "Product Name" },
  ];

  const groups = [
    {
      key: "brand",
      label: "Brand",
      options: brands.map((b) => ({ slug: b.slug, name: b.name })),
    },
    {
      key: "function",
      label: "Function",
      options: functions.map((f) => ({ slug: f.slug, name: f.name })),
    },
    {
      key: "certification",
      label: "Certification",
      options: certifications.map((c) => ({ slug: c.slug, name: c.name })),
    },
  ];

  const activeFilters =
    Object.keys(sp).filter((k) => k !== "sort" && sp[k]).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Breadcrumbs
          locale={locale}
          items={[{ label: t["products.title"] }]}
        />
      </div>

      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-light text-foreground lg:text-4xl">
          {t["products.title"]}
        </h1>
        <p className="text-foreground-muted">
          {data.total} {t["common.products"]}
        </p>
        {filters.search && (
          <p className="text-sm text-foreground-muted">
            {t["search.resultsFor"].replace("{query}", filters.search)}
          </p>
        )}
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <FilterPanel
            groups={groups}
            brands={[] as any}
            functions={[] as any}
            certifications={[] as any}
            packaging={[]}
            productTypes={[]}
            sort={filters.sort ?? "featured"}
            sortOptions={sortOptions}
          />
        </aside>

        {/* Mobile filter toggle */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <Link
              href={`/${locale}/products`}
              className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-foreground-muted"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t["common.filters"]}
              {activeFilters > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs text-white">
                  {activeFilters}
                </span>
              )}
            </Link>
          </div>

          {data.products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-border py-24 text-center">
              <SearchX className="mb-4 h-10 w-10 text-foreground-subtle" />
              <h3 className="text-lg font-medium text-foreground">
                {t["search.noResults"]}
              </h3>
              <p className="mt-2 max-w-sm text-sm text-foreground-muted">
                {t["search.noResultsDesc"]}
              </p>
              <Link
                href={`/${locale}/products`}
                className="mt-6 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background"
              >
                {t["common.clear"]}
              </Link>
            </div>
          ) : (
            <ProductGrid products={data.products.map(toProductCardData)} columns={3} />
          )}
        </div>
      </div>
    </div>
  );
}
