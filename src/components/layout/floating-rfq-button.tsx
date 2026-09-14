"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { useRfqStore } from "@/lib/rfq-store";
import Link from "next/link";
import { ClipboardList } from "lucide-react";

export function FloatingRfqButton() {
  const { t, locale } = useI18n();
  const items = useRfqStore((s) => s.items);

  if (items.length === 0) return null;

  return (
    <>
      {/* Desktop floating */}
      <Link
        href={`/${locale}/rfq-list`}
        className="fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 lg:flex"
      >
        <ClipboardList className="h-4 w-4" />
        {t("rfq.rfqList")} ({items.length})
      </Link>

      {/* Mobile sticky bottom */}
      <Link
        href={`/${locale}/rfq-list`}
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center gap-2 bg-foreground px-6 py-4 text-sm font-medium text-background lg:hidden"
      >
        <ClipboardList className="h-4 w-4" />
        {t("rfq.rfqList")} · {items.length} {t("rfq.products")}
      </Link>
    </>
  );
}
