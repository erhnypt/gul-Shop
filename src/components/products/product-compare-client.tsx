"use client";

import { useCompareStore } from "@/lib/compare-store";
import { useI18n } from "@/components/providers/i18n-provider";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MAX_COMPARE_ITEMS } from "@/lib/compare-store";

interface CompareProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  productType: string | null;
  packaging: string | null;
  size: string | null;
  moq: number | null;
  moqNote: string | null;
  shelfLife: string | null;
  leadTime: string | null;
  availability: string;
  sampleAvailable: boolean;
  oemOdmAvailable: boolean;
  benefits: string | null;
  image: string | null;
  certifications: string[];
}

export function ProductCompareClient() {
  const { t, locale } = useI18n();
  const items = useCompareStore((s) => s.items);
  const setOpen = useCompareStore((s) => s.setOpen);
  const removeItem = useCompareStore((s) => s.removeItem);

  const [products, setProducts] = useState<CompareProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const slugs = items.map((i) => i.slug).join(",");
    fetch(`/api/compare?slugs=${encodeURIComponent(slugs)}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, [items]);

  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  if (loading) {
    return <p className="px-4 py-24 text-center text-foreground-muted">{t("common.loading")}</p>;
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center px-4 py-24 text-center">
        <p className="font-serif text-2xl text-foreground">Compare Products</p>
        <p className="mt-2 max-w-sm text-foreground-muted">
          Add up to {MAX_COMPARE_ITEMS} products to compare. Use the scale icon on any product card.
        </p>
        <Link
          href={`/${locale}/products`}
          className="mt-8 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-foreground/90"
        >
          {t("common.exploreProducts")}
        </Link>
      </div>
    );
  }

  const moqLabel = (p: CompareProduct) =>
    p.moq ? `MOQ: ${p.moq.toLocaleString()} units` : p.moqNote ?? "Contact us";

  const rows: { label: string; get: (p: CompareProduct) => React.ReactNode }[] = [
    { label: t("common.brand"), get: (p) => p.brand },
    { label: t("common.category"), get: (p) => p.productType ?? "—" },
    { label: t("common.packaging"), get: (p) => p.packaging ?? "—" },
    { label: t("common.availableSizes"), get: (p) => p.size ?? "—" },
    { label: t("common.moq"), get: moqLabel },
    { label: t("common.shelfLife"), get: (p) => p.shelfLife ?? "—" },
    { label: t("common.leadTime"), get: (p) => p.leadTime ?? "—" },
    { label: t("common.certifications"), get: (p) => (p.certifications.length ? p.certifications.join(", ") : "—") },
    { label: t("common.sampleAvailability"), get: (p) => (p.sampleAvailable ? "Yes" : "On request") },
    { label: t("common.oemOdm"), get: (p) => (p.oemOdmAvailable ? "Yes" : "On request") },
    { label: t("common.availability"), get: (p) => p.availability.replace(/_/g, " ").toLowerCase() },
    { label: t("common.benefits"), get: (p) => p.benefits ?? "—" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-light text-foreground">Product Comparison</h1>
        <Link href={`/${locale}/products`} className="text-sm text-accent hover:underline">
          {t("common.exploreProducts")}
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-background">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="w-40 px-4 py-4" />
              {products.map((p) => (
                <th key={p.id} className="px-4 py-4 align-top">
                  <Link href={`/${locale}/products/${p.slug}`} className="font-serif text-lg text-foreground hover:text-accent">
                    {p.name}
                  </Link>
                  <span className="mt-1 block text-xs font-normal uppercase tracking-wider text-accent">
                    {p.brand}
                  </span>
                  <button
                    onClick={() => removeItem(p.id)}
                    className="mt-2 text-xs font-normal text-foreground-subtle hover:text-error"
                  >
                    Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border/60">
                <td className="bg-surface/40 px-4 py-3 font-medium text-foreground">{row.label}</td>
                {products.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-foreground-muted">
                    {row.get(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border">
              <td />
              {products.map((p) => (
                <td key={p.id} className="px-4 py-4">
                  <Link href={`/${locale}/products/${p.slug}?rfq=1`}>
                    <Button variant="primary" size="sm" fullWidth>
                      {t("common.requestWholesaleQuote")}
                    </Button>
                  </Link>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}