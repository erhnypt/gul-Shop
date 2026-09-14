import { getDictionary } from "@/lib/i18n";

const points = [
  "Authentic Thai herbal & botanical ingredients",
  "Advanced R&D and modern skincare science",
  "Competitive factory-direct wholesale pricing",
  "Strong regulatory compliance for exports",
  "Cost-effective sachet packaging expertise",
];

export async function WhyThaiSection({ locale }: { locale: string }) {
  const t = await getDictionary(locale);
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {t["whyThai.title"]}
            </p>
            <h2 className="mb-6 font-serif text-3xl font-light text-foreground lg:text-4xl">
              {t["whyThai.title"]}
            </h2>
            <p className="mb-8 text-base leading-relaxed text-foreground-muted">
              {t["whyThai.subtitle"]}. Thailand blends traditional herbal
              wisdom with modern cosmetic science, producing globally
              competitive skincare known for quality and innovation.
            </p>
            <ul className="space-y-4">
              {points.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs text-accent">
                    ✓
                  </span>
                  <span className="text-sm text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-none bg-gradient-to-br from-accent/20 via-surface to-surface" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="font-serif text-5xl text-accent">100%</div>
                <div className="mt-2 text-xs uppercase tracking-widest text-foreground-muted">
                  Authentic Thai
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
