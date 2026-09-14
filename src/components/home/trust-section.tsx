"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { ShieldCheck, Globe2, Package, Droplets } from "lucide-react";

export function TrustSection() {
  const { t } = useI18n();
  const cards = [
    {
      icon: ShieldCheck,
      title: t("trust.authentic.title"),
      desc: t("trust.authentic.desc"),
    },
    {
      icon: Globe2,
      title: t("trust.export.title"),
      desc: t("trust.export.desc"),
    },
    {
      icon: Package,
      title: t("trust.moq.title"),
      desc: t("trust.moq.desc"),
    },
    {
      icon: Droplets,
      title: t("trust.sachet.title"),
      desc: t("trust.sachet.desc"),
    },
  ];

  return (
    <section className="border-b border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {t("trust.title")}
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <div
              key={i}
              className="flex flex-col border-t border-border pt-6"
            >
              <card.icon className="mb-4 h-6 w-6 text-accent" strokeWidth={1.5} />
              <h3 className="mb-2 font-serif text-xl font-medium text-foreground">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-foreground-muted">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
