"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/lib/compare-store";
import { useRfqStore } from "@/lib/rfq-store";
import { trackClientEvent } from "@/lib/analytics-client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ClipboardPlus, Scale } from "lucide-react";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  productType: string | null;
  shortDescription: string | null;
  packaging: string | null;
  moq: number | null;
  brand: { name: string; slug: string };
  image: string | null;
  certifications: { certification: { id: string; name: string; slug: string } }[];
}

export function ProductCard({
  product,
  priority,
}: {
  product: ProductCardData;
  priority?: boolean;
}) {
  const { t, locale } = useI18n();
  const addItem = useRfqStore((s) => s.addItem);
  const compareItems = useCompareStore((s) => s.items);
  const addCompare = useCompareStore((s) => s.addItem);
  const removeCompare = useCompareStore((s) => s.removeItem);

  const addToRfq = () => {
    trackClientEvent("RFQ_CLICK", { productSlug: product.slug, locale });
    addItem({
      productId: product.id,
      name: product.name,
      brandName: product.brand.name,
      image: product.image,
      slug: product.slug,
      quantity: product.moq ?? 1000,
    });
  };

  const inCompare = compareItems.some((c) => c.productId === product.id);
  const toggleCompare = () => {
    if (inCompare) {
      removeCompare(product.id);
    } else {
      addCompare({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        brandName: product.brand.name,
        image: product.image,
      });
      trackClientEvent("COMPARE", { productSlug: product.slug, locale });
    }
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-none border border-border bg-background transition-all duration-300 hover:shadow-lg">
      {/* Image */}
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden bg-surface"
      >
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface to-accent/10">
            <span className="font-serif text-2xl tracking-tight text-foreground-subtle">
              {product.brand.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/5" />
        {product.certifications.length > 0 && (
          <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
            {product.certifications.slice(0, 2).map((c) => (
              <Badge key={c.certification.id} variant="accent">
                {c.certification.name}
              </Badge>
            ))}
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wider text-accent">
          {product.brand.name}
        </span>
        <Link href={`/${locale}/products/${product.slug}`}>
          <h3 className="mt-1 font-serif text-lg leading-snug text-foreground transition-colors group-hover:text-accent-dark">
            {product.name}
          </h3>
        </Link>
        {product.shortDescription && (
          <p className="mt-1 line-clamp-2 text-sm text-foreground-muted">
            {product.shortDescription}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-foreground-muted">
          {product.productType && (
            <span className="rounded-sm border border-border px-2 py-0.5">
              {product.productType}
            </span>
          )}
          {product.packaging && (
            <span className="rounded-sm border border-border px-2 py-0.5">
              {product.packaging}
            </span>
          )}
          <span className="font-medium text-foreground">
            {product.moq ? t("common.moqNote", { count: product.moq }) : t("common.moqContact")}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/${locale}/products/${product.slug}?rfq=1`}
            onClick={() => trackClientEvent("RFQ_CLICK", { productSlug: product.slug, locale })}
            className="flex-1"
          >
            <Button variant="primary" size="sm" fullWidth>
              {t("common.requestWholesaleQuote")}
            </Button>
          </Link>
          <button
            onClick={addToRfq}
            aria-label={t("common.addToRfq")}
            title={t("common.addToRfq")}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent"
            )}
          >
            <ClipboardPlus className="h-4 w-4" />
          </button>
          <button
            onClick={toggleCompare}
            aria-label="Compare"
            title={inCompare ? "Remove from compare" : "Compare"}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors",
              inCompare
                ? "border-accent bg-accent text-white"
                : "border-border text-foreground-muted hover:border-accent hover:text-accent"
            )}
          >
            <Scale className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
