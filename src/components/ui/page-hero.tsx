import { getDictionary } from "@/lib/i18n";

export async function PageHero({
  locale,
  eyebrowKey,
  titleKey,
  subtitleKey,
}: {
  locale: string;
  eyebrowKey: string;
  titleKey: string;
  subtitleKey?: string;
}) {
  const t = await getDictionary(locale);
  return (
    <div className="border-b border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {t[eyebrowKey as keyof typeof t] ?? eyebrowKey}
        </p>
        <h1 className="font-serif text-4xl font-light text-foreground lg:text-5xl">
          {t[titleKey as keyof typeof t] ?? titleKey}
        </h1>
        {subtitleKey && (
          <p className="mx-auto mt-4 max-w-2xl text-base text-foreground-muted">
            {t[subtitleKey as keyof typeof t]}
          </p>
        )}
      </div>
    </div>
  );
}
