import { PageHero } from "@/components/ui/page-hero";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/ui/container";
import { getDictionary } from "@/lib/i18n";
import { getSiteSettings } from "@/server/queries";
import { ContactForm } from "@/components/forms/contact-form";
import { Mail, MessageCircle, Phone, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getDictionary(locale);
  const settings = await getSiteSettings();

  const details = [
    settings?.salesEmail && { icon: Mail, label: t["contact.businessEmail"], value: settings.salesEmail },
    settings?.generalEmail && { icon: Mail, label: "General", value: settings.generalEmail },
    settings?.whatsappNumber && { icon: MessageCircle, label: t["contact.whatsapp"], value: settings.whatsappNumber },
    settings?.phone && { icon: Phone, label: t["contact.phone"], value: settings.phone },
    settings?.address && { icon: MapPin, label: t["contact.address"], value: settings.address },
    settings?.businessHours && { icon: Clock, label: t["contact.businessHours"], value: settings.businessHours },
  ].filter(Boolean);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Breadcrumbs locale={locale} items={[{ label: t["contact.title"] }]} />
      </div>
      <PageHero locale={locale} eyebrowKey="contact.title" titleKey="contact.title" subtitleKey="contact.subtitle" />

      <Container className="grid gap-12 py-16 lg:grid-cols-2">
        {/* Details */}
        <div>
          <h2 className="mb-6 font-serif text-2xl font-light text-foreground">
            {settings?.siteName ?? "GulShop"}
          </h2>
          <div className="space-y-5">
            {details.map((d: any, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <d.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-foreground-subtle">{d.label}</p>
                  <p className="mt-0.5 text-sm text-foreground">{d.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href={`/${locale}/request-a-quote`}
              className="inline-flex rounded-md bg-foreground px-8 py-3 text-sm font-medium text-background hover:bg-foreground/90"
            >
              {t["common.requestWholesaleQuote"]}
            </Link>
          </div>
        </div>

        {/* Form */}
        <ContactForm locale={locale} />
      </Container>
    </>
  );
}
