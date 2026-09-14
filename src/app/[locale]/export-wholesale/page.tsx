import { PageHero } from "@/components/ui/page-hero";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getDictionary } from "@/lib/i18n";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import {
  Globe2,
  Package,
  FileText,
  Ship,
  Map,
  CheckCircle,
} from "lucide-react";

export default async function ExportWholesalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getDictionary(locale);

  const wholesale = [
    "Wholesale sourcing and bulk orders",
    "Brand distribution partnerships",
    "Sachet product supply",
    "Low MOQ and trial orders",
    "Factory-direct pricing terms",
  ];

  const docs = [
    "Certificate of Free Sale (where applicable)",
    "Product information and ingredient documentation",
    "Thai FDA documentation (where applicable)",
    "GMP / HACCP / Halal certificates (per product)",
    "Commercial invoice",
    "Packing list",
    "Certificate of Origin",
  ];

  const shipping = [
    { title: "Air Freight", desc: "Fast delivery for smaller and time-sensitive orders." },
    { title: "Sea Freight (FCL)", desc: "Full container loads for large wholesale volumes." },
    { title: "Sea Freight (LCL)", desc: "Less-than-container-load for scalable shipments." },
    { title: "Courier Samples", desc: "Low-cost sample shipping for evaluation." },
  ];

  const markets = ["Middle East", "Europe", "Africa", "Asia", "Americas"];

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          locale={locale}
          items={[{ label: t["export.hero.title"] }]}
        />
      </div>
      <PageHero
        locale={locale}
        eyebrowKey="export.hero.title"
        titleKey="export.hero.title"
        subtitleKey="export.hero.subtitle"
      />

      <Container className="py-16 lg:py-20">
        {/* Why Source Thai Beauty */}
        <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Globe2 className="h-6 w-6 text-accent" />
            </div>
            <h2 className="mb-4 font-serif text-2xl font-light text-foreground lg:text-3xl">
              Why Source Thai Beauty?
            </h2>
            <p className="leading-relaxed text-foreground-muted">
              Thailand is one of Asia's leading beauty and personal care markets. Its
              manufacturers combine traditional herbal and botanical ingredients with modern
              cosmetic science, producing globally competitive products valued for quality,
              innovation and cost-effectiveness. For international B2B buyers, Thai beauty
              offers a strong sourcing alternative for skincare, sun care, sachet products and
              more.
            </p>
          </div>
          <div className="border border-border bg-surface/50 p-8">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
              Wholesale Supply
            </h3>
            <ul className="space-y-3">
              {wholesale.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground-muted">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Export Documentation */}
        <section className="mt-20">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <FileText className="h-6 w-6 text-accent" />
          </div>
          <h2 className="mb-3 font-serif text-2xl font-light text-foreground lg:text-3xl">
            Export Documentation
          </h2>
          <p className="mb-8 max-w-3xl text-foreground-muted">
            Available documentation is confirmed on a product-by-product basis and never assumed.
            Our team verifies each product's specific certificates for your destination market.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {docs.map((doc, i) => (
              <div key={i} className="border border-border bg-background p-5 text-sm text-foreground hover:border-accent/40 hover:shadow-sm transition-all">
                <Package className="mb-3 h-5 w-5 text-accent" />
                {doc}
              </div>
            ))}
          </div>
        </section>

        {/* Shipping */}
        <section className="mt-20">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Ship className="h-6 w-6 text-accent" />
          </div>
          <h2 className="mb-8 font-serif text-2xl font-light text-foreground lg:text-3xl">
            Shipping
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {shipping.map((s, i) => (
              <div key={i} className="border-t-2 border-accent/40 bg-surface/40 p-6">
                <h3 className="mb-2 text-sm font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-foreground-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Global Markets */}
        <section className="mt-20">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Map className="h-6 w-6 text-accent" />
          </div>
          <h2 className="mb-3 font-serif text-2xl font-light text-foreground lg:text-3xl">
            Global Markets
          </h2>
          <p className="mb-6 max-w-3xl text-foreground-muted">{t["export.markets.desc"]}</p>
          <div className="flex flex-wrap gap-3">
            {markets.map((m) => (
              <span key={m} className="rounded-full border border-border px-5 py-2 text-sm text-foreground">
                {m}
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-20 rounded-lg bg-foreground p-10 text-center">
          <h2 className="font-serif text-2xl font-light text-background lg:text-3xl">
            Ready to discuss your wholesale requirements?
          </h2>
          <Link
            href={`/${locale}/request-a-quote`}
            className="mt-6 inline-flex rounded-md bg-accent px-8 py-3.5 text-sm font-medium text-white hover:bg-accent-dark"
          >
            {t["common.requestWholesaleQuote"]}
          </Link>
        </div>
      </Container>
    </>
  );
}
