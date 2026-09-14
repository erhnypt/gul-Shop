import { getDictionary } from "@/lib/i18n";

export async function ProcessSection({ locale }: { locale: string }) {
  const t = await getDictionary(locale);
  const steps = [
    { num: "01", title: t["process.step1.title"], desc: t["process.step1.desc"] },
    { num: "02", title: t["process.step2.title"], desc: t["process.step2.desc"] },
    { num: "03", title: t["process.step3.title"], desc: t["process.step3.desc"] },
    { num: "04", title: t["process.step4.title"], desc: t["process.step4.desc"] },
    { num: "05", title: t["process.step5.title"], desc: t["process.step5.desc"] },
  ];

  return (
    <section className="border-y border-border bg-surface/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {t["process.title"]}
          </p>
          <h2 className="font-serif text-3xl font-light text-foreground lg:text-4xl">
            {t["process.title"]}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step) => (
            <div key={step.num} className="relative border-t border-border pt-6">
              <span className="font-serif text-3xl font-light text-accent">
                {step.num}
              </span>
              <h3 className="mt-3 text-sm font-semibold uppercase tracking-wide text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
