import prisma from "@/lib/prisma";
import Link from "next/link";
import { Eye, Search, ClipboardList, Scale, TrendingUp } from "lucide-react";

export const metadata = { title: "Analytics — Admin" };

function Bar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.max(3, Math.round((value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-32 shrink-0 truncate text-foreground-muted" title={label}>
        {label}
      </span>
      <div className="h-5 flex-1 overflow-hidden rounded bg-surface">
        <div className="h-full rounded bg-accent" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 shrink-0 text-right text-foreground">{value}</span>
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const sinceDays = 30;
  const since = new Date(Date.now() - sinceDays * 86400000);

  const [
    totalEvents,
    typeCounts,
    mostViewedAgg,
    searchAgg,
    dailyAgg,
  ] = await Promise.all([
    prisma.analyticsEvent.count({ where: { createdAt: { gte: since } } }),
    prisma.analyticsEvent.groupBy({
      by: ["eventType"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["productSlug"],
      where: { eventType: "PRODUCT_VIEW", productSlug: { not: null }, createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { productSlug: "desc" } },
      take: 8,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["query"],
      where: { eventType: "SEARCH", query: { not: null }, createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { query: "desc" } },
      take: 8,
    }),
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
  ]);

  const viewedProducts =
    mostViewedAgg.length > 0
      ? await prisma.product.findMany({
          where: { slug: { in: mostViewedAgg.map((a) => a.productSlug as string) } },
          select: { slug: true, name: true },
        })
      : [];
  const productName = (slug: string) => viewedProducts.find((p) => p.slug === slug)?.name ?? slug;

  const maxViewed = Math.max(1, ...mostViewedAgg.map((a) => a._count._all));
  const maxSearch = Math.max(1, ...searchAgg.map((a) => a._count._all));

  const daily = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    daily.set(d.toISOString().slice(0, 10), 0);
  }
  for (const ev of dailyAgg) {
    const key = ev.createdAt.toISOString().slice(0, 10);
    if (daily.has(key)) daily.set(key, (daily.get(key) ?? 0) + 1);
  }
  const dailyData = [...daily.entries()];
  const maxDay = Math.max(1, ...dailyData.map(([, v]) => v));

  const typeMeta: Record<string, { label: string; icon: any }> = {
    PRODUCT_VIEW: { label: "Product views", icon: Eye },
    BRAND_VIEW: { label: "Brand views", icon: Eye },
    RFQ_CLICK: { label: "RFQ clicks", icon: ClipboardList },
    RFQ_SUBMIT: { label: "RFQ submissions", icon: ClipboardList },
    SEARCH: { label: "Searches", icon: Search },
    COMPARE: { label: "Compare uses", icon: Scale },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-light text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Lightweight aggregate events from the last {sinceDays} days. No personal data is stored.
        </p>
      </div>

      {/* Event type summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Object.entries(typeMeta).map(([type, meta]) => {
          const count = typeCounts.find((t) => t.eventType === type)?._count._all ?? 0;
          const Icon = meta.icon;
          return (
            <div key={type} className="rounded-lg border border-border bg-background p-5">
              <Icon className="mb-3 h-5 w-5 text-accent" />
              <p className="font-serif text-2xl font-light text-foreground">{count}</p>
              <p className="mt-1 text-xs text-foreground-muted">{meta.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Most viewed products */}
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="mb-4 flex items-center gap-2">
            <Eye className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Most Viewed Products</h2>
          </div>
          <div className="space-y-2">
            {mostViewedAgg.length === 0 && <p className="text-sm text-foreground-subtle">No product views yet</p>}
            {mostViewedAgg.map((a) => (
              <Bar key={a.productSlug} label={productName(a.productSlug ?? "")} value={a._count._all} max={maxViewed} />
            ))}
          </div>
        </div>

        {/* Top search terms */}
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Top Search Terms</h2>
          </div>
          <div className="space-y-2">
            {searchAgg.length === 0 && <p className="text-sm text-foreground-subtle">No searches yet</p>}
            {searchAgg.map((s) => (
              <Bar key={s.query} label={`"${s.query}"`} value={s._count._all} max={maxSearch} />
            ))}
          </div>
        </div>
      </div>

      {/* Daily events */}
      <div className="rounded-lg border border-border bg-background p-5">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            Events · Last 14 Days ({totalEvents} in {sinceDays} days)
          </h2>
        </div>
        <div className="flex h-40 items-end gap-1">
          {dailyData.map(([day, v]) => (
            <div key={day} className="group relative flex flex-1 flex-col items-center justify-end self-stretch">
              <span className="mb-1 text-[10px] text-foreground-subtle opacity-0 transition-opacity group-hover:opacity-100">
                {v}
              </span>
              <div
                className="w-full rounded-t bg-accent/80 transition-colors hover:bg-accent"
                style={{ height: `${Math.max(3, (v / maxDay) * 100)}%` }}
              />
              <span className="mt-1 text-[10px] text-foreground-subtle">{day.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-foreground-subtle">
        <Link href="/admin/audit-logs" className="text-accent hover:underline">
          View audit logs
        </Link>{" "}
        for a complete admin action history.
      </p>
    </div>
  );
}