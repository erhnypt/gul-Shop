"use client";

import { useCompareStore, MAX_COMPARE_ITEMS } from "@/lib/compare-store";
import { useI18n } from "@/components/providers/i18n-provider";
import Link from "next/link";
import { Scale, X } from "lucide-react";

export function FloatingCompareBar() {
  const { t, locale } = useI18n();
  const items = useCompareStore((s) => s.items);
  const removeItem = useCompareStore((s) => s.removeItem);
  const clear = useCompareStore((s) => s.clear);

  if (items.length === 0) return null;

  return (
    <>
      {/* Desktop floating bottom-left */}
      <div className="fixed bottom-6 left-6 z-40 hidden w-72 rounded-lg border border-border bg-background p-3 shadow-lg lg:block">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Scale className="h-4 w-4 text-accent" />
            Compare ({items.length}/{MAX_COMPARE_ITEMS})
          </span>
          <button onClick={clear} className="text-xs text-foreground-subtle hover:text-error">
            Clear
          </button>
        </div>
        <ul className="mb-3 space-y-1">
          {items.map((i) => (
            <li key={i.productId} className="flex items-center justify-between gap-2 text-xs text-foreground-muted">
              <span className="truncate">{i.name}</span>
              <button
                onClick={() => removeItem(i.productId)}
                aria-label="Remove"
                className="text-foreground-subtle hover:text-error"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <Link
          href={`/${locale}/products/compare`}
          className="block rounded-md bg-foreground px-3 py-2 text-center text-xs font-medium text-background hover:bg-foreground/90"
        >
          Compare Products
        </Link>
      </div>

      {/* Mobile sticky above rfq bar */}
      <Link
        href={`/${locale}/products/compare`}
        className="fixed inset-x-4 bottom-16 z-40 flex items-center justify-center gap-2 bg-accent px-6 py-3 text-sm font-medium text-white shadow-lg lg:hidden"
      >
        <Scale className="h-4 w-4" />
        Compare ({items.length}/{MAX_COMPARE_ITEMS})
      </Link>
    </>
  );
}