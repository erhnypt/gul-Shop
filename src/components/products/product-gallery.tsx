"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export function ProductGallery({
  images,
  name,
}: {
  images: { url: string; alt: string | null }[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const imgs = images.length > 0 ? images : [{ url: "", alt: name }];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden border border-border bg-surface">
        {imgs[active].url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgs[active].url}
            alt={imgs[active].alt ?? name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface to-accent/10">
            <span className="font-serif text-3xl text-foreground-subtle">
              {name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      {imgs.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {imgs.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "aspect-square overflow-hidden border bg-surface transition-colors",
                active === i
                  ? "border-accent"
                  : "border-border hover:border-foreground-subtle"
              )}
            >
              {img.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.url} alt={img.alt ?? name} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center font-serif text-lg text-foreground-subtle">
                  {i + 1}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
