import { getDictionary } from "@/lib/i18n";
import Link from "next/link";

export async function SachetBanner({ locale }: { locale: string }) {
  const t = await getDictionary(locale);
  return (
    <section className="relative overflow-hidden bg-foreground py-20 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/95 to-accent/20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {t["sachet.banner.title"]}
          </p>
          <h2 className="font-serif text-3xl font-light text-background sm:text-4xl lg:text-5xl">
            {t["sachet.banner.desc"]}
          </h2>
          <Link
            href={`/${locale}/sachet-skincare`}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
          >
            {t["sachet.banner.cta"]} →
          </Link>
        </div>
      </div>
    </section>
  );
}
