import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingRfqButton } from "@/components/layout/floating-rfq-button";
import { FloatingCompareBar } from "@/components/layout/floating-compare-bar";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { locales } from "@/config/i18n";
import { getFunctions, getCertifications, getSiteSettings } from "@/server/queries";
import { getDictionary } from "@/lib/i18n";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getDictionary(locale);
  return {
    title: {
      default: "GulShop — Premium Thai Beauty Wholesale & Export",
      template: "%s | GulShop",
    },
    description: t["footer.tagline"] as string,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolved = (locales as string[]).includes(locale) ? locale : "en";

  const [settings, functions, certifications, dictionary] = await Promise.all([
    getSiteSettings(),
    getFunctions(),
    getCertifications(),
    getDictionary(resolved),
  ]);

  const funcs = functions.map((f) => ({ slug: f.slug, name: f.name }));
  const certs = certifications.map((c) => ({ slug: c.slug, name: c.name }));

  const whatsapp = settings?.whatsappNumber ?? process.env.WHATSAPP_NUMBER ?? null;
  const email = settings?.salesEmail ?? process.env.SALES_EMAIL ?? null;

  return (
    <I18nProvider dictionary={dictionary} locale={resolved}>
      <div className="flex min-h-screen flex-col">
        <AnnouncementBar locale={resolved} />
        <Header
          whatsapp={whatsapp}
          email={email}
          functions={funcs}
          certifications={certs}
        />
        <main className="flex-1">{children}</main>
        <Footer locale={resolved} settings={settings} />
        <FloatingRfqButton />
        <FloatingCompareBar />
        {whatsapp && <WhatsAppFloat phone={whatsapp} />}
      </div>
    </I18nProvider>
  );
}
