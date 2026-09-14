import { FaqSection } from "@/components/home/faq-section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getDictionary } from "@/lib/i18n";

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getDictionary(locale);
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Breadcrumbs locale={locale} items={[{ label: t["faq.title"] }]} />
      </div>
      <FaqSection locale={locale} />
    </div>
  );
}