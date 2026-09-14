import { getDictionary } from "@/lib/i18n";
import Link from "next/link";

export async function CtaSection({ locale }: { locale: string }) {
  const t = await getDictionary(locale);
  return (
    <section className="bg-foreground py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-light text-background sm:text-4xl lg:text-5xl">
          {t["cta.title"]}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-background/70">
          {t["cta.desc"]}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href={`/${locale}/request-a-quote`}
            className="rounded-md bg-accent px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
          >
            {t["common.requestWholesaleQuote"]}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="rounded-md border border-background/30 px-8 py-3.5 text-sm font-medium text-background transition-colors hover:bg-background hover:text-foreground"
          >
            {t["common.contactSales"]}
          </Link>
        </div>
      </div>
    </section>
  );
}
