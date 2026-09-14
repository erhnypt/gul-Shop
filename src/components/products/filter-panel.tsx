"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Filter, X } from "lucide-react";

export interface FilterOption {
  slug: string;
  name: string;
  count?: number;
}

export interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
}

interface FilterSidebarProps {
  groups: FilterGroup[];
  brands: FilterOption[];
  functions: FilterOption[];
  certifications: FilterOption[];
  packaging: FilterOption[];
  productTypes: FilterOption[];
  sort: string;
  sortOptions: { value: string; label: string }[];
  mobile?: boolean;
  onClose?: () => void;
}

export function FilterPanel({
  groups,
  sort,
  sortOptions,
  mobile,
  onClose,
}: FilterSidebarProps) {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const existing = params.get(key);
      if (existing === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const removeFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`?${params.toString()}`);
  };

  const clearAll = () => router.push("?");

  const activeCount = Array.from(searchParams.keys()).length;

  return (
    <div className={cn("space-y-6", mobile && "p-5")}>
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground">
          <Filter className="h-4 w-4" /> {t("common.filters")}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-accent hover:underline"
          >
            {t("common.clear")}
          </button>
        )}
      </div>

      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {groups.flatMap((g) => {
            const v = searchParams.get(g.key);
            if (!v) return [];
            const opt = g.options.find((o) => o.slug === v);
            return (
              <button
                key={g.key}
                onClick={() => removeFilter(g.key, v)}
                className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs text-accent-dark hover:bg-accent/20"
              >
                {opt?.name ?? v}
                <X className="h-3 w-3" />
              </button>
            );
          })}
        </div>
      )}

      {groups.map((group) => {
        const selected = searchParams.get(group.key) ?? "";
        if (group.options.length === 0) return null;
        return (
          <div key={group.key} className="border-t border-border pt-5">
            <h4 className="mb-3 text-sm font-medium text-foreground">
              {group.label}
            </h4>
            <div className="space-y-2">
              {group.options.map((opt) => {
                const isSelected = selected === opt.slug;
                return (
                  <button
                    key={opt.slug}
                    onClick={() => {
                      updateParams(group.key, opt.slug);
                      onClose?.();
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded px-3 py-2 text-sm transition-colors",
                      isSelected
                        ? "bg-surface-hover font-medium text-foreground"
                        : "text-foreground-muted hover:bg-surface-hover/50"
                    )}
                  >
                    <span>{opt.name}</span>
                    {typeof opt.count === "number" && (
                      <span className="text-xs text-foreground-subtle">
                        {opt.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Sort */}
      <div className="border-t border-border pt-5">
        <h4 className="mb-3 text-sm font-medium text-foreground">
          {t("common.sort")}
        </h4>
        <select
          value={sort}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("sort", e.target.value);
            router.push(`?${params.toString()}`);
            onClose?.();
          }}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
