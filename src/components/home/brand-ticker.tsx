"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import Link from "next/link";

export interface BrandR {
  slug: string;
  name: string;
  logoUrl: string | null;
}

export function BrandTicker({ brands }: { brands: BrandR[] }) {
  const { locale } = useI18n();
  if (brands.length === 0) return null;
  const doubled = [...brands, ...brands];

  return (
    <section className="border-b border-border py-12">
      <div className="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-center gap-2 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex shrink-0 animate-marquee gap-10 pr-10">
            {doubled.map((brand, i) => (
              <Link
                key={`${brand.slug}-${i}`}
                href={`/${locale}/brands/${brand.slug}`}
                className="flex h-16 w-40 shrink-0 items-center justify-center border border-border bg-surface/50 px-4 grayscale transition-all duration-300 hover:grayscale-0 hover:scale-105 hover:border-accent/40"
              >
                <span className="font-serif text-lg font-semibold text-foreground">
                  {brand.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={brand.logoUrl} alt={brand.name} className="h-8 w-auto object-contain" />
                  ) : (
                    brand.name
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
