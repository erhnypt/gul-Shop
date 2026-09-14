import { getTestimonials } from "@/server/queries";
import { Star } from "lucide-react";

export async function TestimonialSection() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-surface/60 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Trusted by International Buyers
          </p>
          <h2 className="font-serif text-3xl font-light text-foreground lg:text-4xl">
            What buyers say
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="flex flex-col rounded-lg border border-border bg-background p-6"
            >
              <div className="mb-3 flex items-center gap-0.5 text-warning">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground-muted">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 border-t border-border pt-4">
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                {(t.role || t.companyName) && (
                  <p className="text-xs text-foreground-subtle">
                    {[t.role, t.companyName, t.country].filter(Boolean).join(" · ")}
                  </p>
                )}
                {t.isVerified && (
                  <p className="mt-1 text-xs font-medium text-success">Verified buyer</p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}