import { PageHero } from "@/components/ui/page-hero";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getDictionary } from "@/lib/i18n";
import { getSiteSettings } from "@/server/queries";
import Link from "next/link";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getDictionary(locale);
  const settings = await getSiteSettings();

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Breadcrumbs locale={locale} items={[{ label: t["about.title"] }]} />
      </div>
      <PageHero locale={locale} eyebrowKey="about.title" titleKey="about.title" subtitleKey="about.subtitle" />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="space-y-8">
          <div>
            <h2 className="mb-4 font-serif text-2xl font-light text-foreground">Overview</h2>
            <p className="leading-relaxed text-foreground-muted">
              {settings?.siteName ?? "GulShop"} is a wholesale sourcing and export platform
              specializing in authentic Thai beauty and skincare products. We connect
              international distributors, importers, wholesalers and retail chains directly
              with trusted Thai beauty manufacturers.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-2xl font-light text-foreground">Thai Beauty Expertise</h2>
            <p className="leading-relaxed text-foreground-muted">
              Thailand is a globally recognised beauty market, blending traditional herbal
              wisdom with modern skincare science. Our focus spans skincare, sun protection,
              acne care, hydration, brightening, body care, hair care and sachet packaging.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-2xl font-light text-foreground">Sourcing Network</h2>
            <p className="leading-relaxed text-foreground-muted">
              We work with a network of vetted Thai beauty manufacturers to support
              factory-direct wholesale supply, trial orders, low MOQs and scalable
              international shipments.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-2xl font-light text-foreground">Quality Control</h2>
            <p className="leading-relaxed text-foreground-muted">
              Products are selected with international market requirements in mind. Where
              available, relevant certifications and export documentation accompany individual
              products — always verified and assigned on a product-by-product basis.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-2xl font-light text-foreground">Export Capability</h2>
            <p className="leading-relaxed text-foreground-muted">
              We support international buyers across multiple markets through B2B wholesale
              communication, secure RFQ processing and export documentation tailored to each
              product and destination.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-serif text-2xl font-light text-foreground">Mission</h2>
            <p className="leading-relaxed text-foreground-muted">
              To be a trusted partner for international buyers sourcing premium, authentic and
              export-ready Thai beauty products — with transparent wholesale processes, reliable
              documentation and market-focused supply.
            </p>
          </div>

          <div className="pt-6 text-center">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex rounded-md bg-foreground px-8 py-3 text-sm font-medium text-background hover:bg-foreground/90"
            >
              {t["common.contactSales"]}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
