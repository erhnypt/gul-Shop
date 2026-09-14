"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import Link from "next/link";

export interface CertificationRow {
  slug: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
}

export function CertificationGrid({
  certifications,
}: {
  certifications: CertificationRow[];
}) {
  const { locale } = useI18n();
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {certifications.map((c) => (
        <Link
          key={c.slug}
          href={`/${locale}/products?certification=${c.slug}`}
          className="group flex items-center gap-2 rounded-md border border-border bg-surface/50 px-5 py-3 transition-all duration-300 hover:border-accent/40 hover:bg-surface hover:shadow-sm"
        >
          <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
            {c.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
