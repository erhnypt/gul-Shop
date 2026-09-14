import { getDictionary } from "@/lib/i18n";
import { CertificationGrid } from "@/components/home/certification-grid";
import { FunctionGrid } from "@/components/home/function-grid";
import { getCertifications, getFunctions } from "@/server/queries";

export async function FunctionSection({ locale }: { locale: string }) {
  const [t, functions] = await Promise.all([
    getDictionary(locale),
    getFunctions(),
  ]);
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {t["functions.title"]}
          </p>
          <h2 className="text-3xl font-light tracking-tight text-foreground lg:text-4xl">
            {t["functions.title"]}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-foreground-muted">
            {t["functions.subtitle"]}
          </p>
        </div>
        {/* @ts-expect-error Server Component */}
        <FunctionGrid functions={functions} locale={locale} t={t} />
      </div>
    </section>
  );
}
