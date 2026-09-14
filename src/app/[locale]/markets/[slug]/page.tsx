import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getPageBySlug } from "@/server/queries";
import { notFound } from "next/navigation";

export default async function MarketPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const page = await getPageBySlug(`market-${slug}`);

  if (!page) notFound();

  const translation = page.translations.find((t) => t.locale === locale);
  const title = translation?.title ?? page.title;
  const content = translation?.content ?? page.content;

  return (
    <Container className="py-12">
      <div className="mb-6">
        <Breadcrumbs
          locale={locale}
          items={[{ label: "Markets" }, { label: title }]}
        />
      </div>
      <h1 className="mb-6 font-serif text-3xl font-light text-foreground">
        {title}
      </h1>
      <div className="max-w-3xl space-y-4 text-foreground-muted">
        {content ? (
          <div className="whitespace-pre-line leading-relaxed">{content}</div>
        ) : (
          <p>Content for this market page will be added. Contact our team for market-specific information.</p>
        )}
      </div>
    </Container>
  );
}
