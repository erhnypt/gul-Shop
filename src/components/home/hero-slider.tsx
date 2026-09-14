"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Link from "next/link";

export interface HeroSlideData {
  heading: string;
  description: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
}

export function HeroSlider({ slides }: { slides: HeroSlideData[] }) {
  const { t, locale } = useI18n();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden bg-foreground"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid min-h-[70vh] lg:min-h-[80vh] lg:grid-cols-2">
        {/* Text */}
        <div className="relative z-10 flex items-center bg-foreground px-4 py-16 sm:px-6 lg:px-16 lg:py-24">
          <div className="max-w-xl">
            {slides.length > 1 && (
              <div className="mb-6 flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setCurrent(i)}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      i === current ? "w-8 bg-accent" : "w-4 bg-white/30"
                    )}
                  />
                ))}
              </div>
            )}
            <h1 className="font-serif text-4xl font-light leading-tight text-background sm:text-5xl lg:text-6xl">
              {slide.heading}
            </h1>
            {slide.description && (
              <p className="mt-6 max-w-lg text-base leading-relaxed text-background/70 sm:text-lg">
                {slide.description}
              </p>
            )}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={slide.ctaLink ?? `/${locale}/request-a-quote`}>
                <Button variant={slide.ctaText ? "accent" : "primary"} size="lg">
                  {slide.ctaText ?? t("hero.primaryCta")}
                </Button>
              </Link>
              <Link href={`/${locale}/products`}>
                <Button variant="white" size="lg">
                  {t("hero.secondaryCta")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative min-h-[35vh] bg-gradient-to-br from-accent/30 to-foreground/40">
          {slide.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slide.imageUrl}
              alt={slide.heading}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center font-serif text-2xl tracking-wide text-white/60">
                {locale === "th" ? "ความงามไทย" : "Thai Beauty"}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-foreground/20" />
        </div>
      </div>
    </section>
  );
}
