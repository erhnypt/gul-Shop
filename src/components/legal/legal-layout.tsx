import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export async function LegalLayout({
  locale,
  title,
  sections,
}: {
  locale: string;
  title: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <Breadcrumbs locale={locale} items={[{ label: title }]} />
      <Container className="max-w-3xl py-12">
        <h1 className="mb-10 font-serif text-3xl font-light text-foreground">{title}</h1>
        <div className="space-y-10">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="mb-3 font-serif text-xl font-medium text-foreground">{s.heading}</h2>
              {s.body.map((p, j) => (
                <p key={j} className="mb-3 text-sm leading-relaxed text-foreground-muted">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
