import { Accordion } from "@/components/ui/accordion";
import { getDictionary } from "@/lib/i18n";
import { getFaqs } from "@/server/queries";

export async function FaqSection({ locale }: { locale: string }) {
  const [t, faqs] = await Promise.all([getDictionary(locale), getFaqs()]);
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {t["faq.title"]}
          </p>
          <h2 className="font-serif text-3xl font-light text-foreground lg:text-4xl">
            {t["faq.title"]}
          </h2>
          <p className="mt-3 text-foreground-muted">{t["faq.subtitle"]}</p>
        </div>
        <Accordion
          items={faqs.map((f) => ({ question: f.question, answer: f.answer }))}
        />
      </div>
    </section>
  );
}
