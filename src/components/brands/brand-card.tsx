"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import Link from "next/link";

export interface BrandCardData {
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  country: string | null;
  productCount: number;
}

export function BrandCard({ brand }: { brand: BrandCardData }) {
  const { t, locale } = useI18n();
  return (
    <Link
      href={`/${locale}/brands/${brand.slug}`}
      className="group flex flex-col border border-border bg-background p-6 transition-all duration-300 hover:border-accent/40 hover:shadow-lg"
    >
      <div className="mb-4 flex h-16 items-center justify-center">
        {brand.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.logoUrl}
            alt={brand.name}
            className="h-12 w-auto object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
          />
        ) : (
          <span className="font-serif text-2xl font-semibold text-foreground">
            {brand.name}
          </span>
        )}
      </div>
      <h3 className="text-center font-serif text-xl font-medium text-foreground">
        {brand.name}
      </h3>
      <p className="mt-2 line-clamp-3 text-center text-sm text-foreground-muted">
        {brand.description}
      </p>
      <div className="mt-4 flex items-center justify-center gap-3 text-xs text-foreground-subtle">
        <span>
          {brand.productCount} {t("common.products")}
        </span>
        {brand.country && <span>· {brand.country}</span>}
      </div>
    </Link>
  );
}
