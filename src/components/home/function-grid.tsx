"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import Link from "next/link";

export interface FunctionRow {
  slug: string;
  name: string;
  icon: string | null;
  _count: { products: number };
}

export function FunctionGrid({ functions }: { functions: FunctionRow[] }) {
  const { t, locale } = useI18n();
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {functions.map((fn) => (
        <Link
          key={fn.slug}
          href={`/${locale}/products?function=${fn.slug}`}
          className="group flex flex-col items-center justify-center rounded-lg border border-border bg-surface/50 p-6 text-center transition-all duration-300 hover:border-accent/40 hover:bg-surface hover:shadow-md"
        >
          <span className="mb-3 font-serif text-2xl text-accent">
            {fn.icon ?? fn.name.slice(0, 2).toUpperCase()}
          </span>
          <h3 className="text-sm font-medium text-foreground">{fn.name}</h3>
          <p className="mt-1 text-xs text-foreground-subtle">
            {fn._count?.products ?? 0} {t("common.products")}
          </p>
        </Link>
      ))}
    </div>
  );
}
