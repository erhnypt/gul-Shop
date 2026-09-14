import { HeroSlider } from "@/components/home/hero-slider";
import { TrustSection } from "@/components/home/trust-section";
import { FunctionGrid } from "@/components/home/function-grid";
import { CertificationGrid } from "@/components/home/certification-grid";
import { SachetBanner } from "@/components/home/sachet-banner";
import { WhyThaiSection } from "@/components/home/why-thai-section";
import { ProcessSection } from "@/components/home/process-section";
import { BrandTicker } from "@/components/home/brand-ticker";
import { TestimonialSection } from "@/components/home/testimonial-section";
import { FaqSection } from "@/components/home/faq-section";
import { CtaSection } from "@/components/home/cta-section";
import { ProductGrid, toProductCardData } from "@/components/products/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getHeroSlides,
  getFeaturedProducts,
  getSachetProducts,
  getFunctions,
  getCertifications,
  getBrands,
} from "@/server/queries";
import { getDictionary } from "@/lib/i18n";
import Link from "next/link";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [
    slides,
    featured,
    sachet,
    functions,
    certifications,
    brands,
    t,
  ] = await Promise.all([
    getHeroSlides(),
    getFeaturedProducts(),
    getSachetProducts(),
    getFunctions(),
    getCertifications(),
    getBrands(),
    getDictionary(locale),
  ]);

  return (
    <>
      <HeroSlider
        slides={slides.map((s) => ({
          heading: s.heading,
          description: s.description,
          ctaText: s.ctaText,
          ctaLink: s.ctaLink,
          imageUrl: s.imageUrl,
        }))}
      />

      {/* Trust / Value Proposition */}
      <TrustSection />

      {/* Shop by Function */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t["functions.title"]}
            title={t["functions.title"]}
            subtitle={t["functions.subtitle"]}
          />
          <FunctionGrid
            functions={functions as any}
          />
        </div>
      </section>

      {/* Shop by Certification */}
      <section className="border-y border-border bg-surface/40 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t["certifications.title"]}
            title={t["certifications.title"]}
            subtitle={t["certifications.subtitle"]}
          />
          <CertificationGrid certifications={certifications as any} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t["featured.title"]}
            title={t["featured.title"]}
            subtitle={t["featured.subtitle"]}
          />
          <ProductGrid
            products={featured.map(toProductCardData)}
            columns={4}
          />
          <div className="mt-12 text-center">
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center justify-center rounded-md border border-foreground px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {t["featured.viewAll"]} →
            </Link>
          </div>
        </div>
      </section>

      {/* Sachet Expertise Banner */}
      <SachetBanner locale={locale} />

      {/* Trending Sachet Products */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t["trending.title"]}
            title={t["trending.title"]}
            subtitle={t["trending.subtitle"]}
          />
          <ProductGrid
            products={sachet.map(toProductCardData)}
            columns={4}
          />
        </div>
      </section>

      {/* Why Thai Beauty */}
      <WhyThaiSection locale={locale} />

      {/* Export & Wholesale Process */}
      <ProcessSection locale={locale} />

      {/* Brand Partners */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t["brands.title"]}
            title={t["brands.title"]}
            subtitle={t["brands.subtitle"]}
          />
        </div>
      </section>
      <BrandTicker brands={brands.map((b) => ({ slug: b.slug, name: b.name, logoUrl: b.logoUrl }))} />

      {/* Social proof */}
      <TestimonialSection />

      {/* B2B FAQ */}
      <FaqSection locale={locale} />

      {/* CTA */}
      <CtaSection locale={locale} />
    </>
  );
}
