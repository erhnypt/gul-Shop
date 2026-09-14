import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  Package,
  Tags,
  ClipboardList,
  Globe,
  Star,
  Flag,
  Eye,
  Search,
} from "lucide-react";

export default async function AdminDashboard() {
  const [
    productCount,
    brandCount,
    rfqToday,
    rfqMonth,
    pendingRfqs,
    recentRfqs,
    topProductsAgg,
    topBrandsAgg,
    countriesAgg,
    mostViewedAgg,
    searchTermsAgg,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.brand.count(),
    prisma.rFQ.count({
      where: {
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.rFQ.count({
      where: { createdAt: { gte: new Date(new Date().setDate(1)) } },
    }),
    prisma.rFQ.count({ where: { status: "NEW" } }),
    prisma.rFQ.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { items: { include: { product: true } } },
    }),
    prisma.rFQItem.groupBy({
      by: ["productId"],
      _count: { _all: true },
      orderBy: { _count: { productId: "desc" } },
      take: 5,
    }),
    prisma.rFQItem.groupBy({
      by: ["productId"],
      _count: { _all: true },
      orderBy: { _count: { productId: "desc" } },
      take: 50,
    }),
    prisma.rFQ.groupBy({
      by: ["country"],
      _count: { _all: true },
      orderBy: { _count: { country: "desc" } },
      take: 8,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["productSlug"],
      where: { eventType: "PRODUCT_VIEW", productSlug: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { productSlug: "desc" } },
      take: 5,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["query"],
      where: { eventType: "SEARCH", query: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { query: "desc" } },
      take: 5,
    }),
  ]);

  // Resolve top products
  const productIds = topProductsAgg.map((t) => t.productId);
  const [topProducts, topBrands, mostViewedProducts] = await Promise.all([
    prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { brand: true },
    }),
    prisma.product.findMany({
      where: { id: { in: topBrandsAgg.map((t) => t.productId) } },
      include: { brand: true },
    }),
    prisma.product.findMany({
      where: {
        slug: { in: mostViewedAgg.filter((a) => a.productSlug).map((a) => a.productSlug as string) },
      },
      include: { brand: true },
    }),
  ]);

  const viewedRows = mostViewedAgg
    .filter((a) => a.productSlug)
    .map((agg) => ({
      product: mostViewedProducts.find((p) => p.slug === agg.productSlug),
      count: agg._count._all,
    }))
    .filter((r) => r.product);

  const topProductRows = topProductsAgg
    .map((agg) => ({
      product: topProducts.find((p) => p.id === agg.productId),
      count: agg._count._all,
    }))
    .filter((r) => r.product);

  const brandCounts = new Map<string, number>();
  for (const agg of topBrandsAgg) {
    const p = topBrands.find((b) => b.id === agg.productId);
    if (p) {
      brandCounts.set(p.brand.name, (brandCounts.get(p.brand.name) ?? 0) + agg._count._all);
    }
  }
  const topBrandRows = [...brandCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const stats = [
    { label: "Products", value: productCount, icon: Package },
    { label: "Active Brands", value: brandCount, icon: Tags },
    { label: "RFQs Today", value: rfqToday, icon: ClipboardList },
    { label: "RFQs This Month", value: rfqMonth, icon: ClipboardList },
    { label: "Pending RFQs", value: pendingRfqs, icon: ClipboardList },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-2xl font-light text-foreground">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-background p-5">
            <s.icon className="mb-3 h-5 w-5 text-accent" />
            <p className="font-serif text-3xl font-light text-foreground">{s.value}</p>
            <p className="mt-1 text-xs text-foreground-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent RFQs */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Recent Inquiries</h2>
          <Link href="/admin/rfqs" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto rounded-lg border border-border bg-background">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-foreground-subtle">
                <th className="px-4 py-3">RFQ</th>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRfqs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-foreground-subtle">
                    No RFQs yet
                  </td>
                </tr>
              ) : (
                recentRfqs.map((rfq) => (
                  <tr key={rfq.id} className="border-b border-border/60 hover:bg-surface/40">
                    <td className="px-4 py-3">
                      <Link href={`/admin/rfqs/${rfq.id}`} className="font-medium text-accent hover:underline">
                        {rfq.rfqNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{rfq.fullName}</td>
                    <td className="px-4 py-3">{rfq.companyName}</td>
                    <td className="px-4 py-3">{rfq.country}</td>
                    <td className="px-4 py-3">{rfq.items.length}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent-dark">
                        {rfq.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top requested products */}
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Top Requested Products</h2>
          </div>
          <ul className="space-y-3">
            {topProductRows.map((r) => (
              <li key={r.product!.id} className="flex items-center justify-between gap-3 text-sm">
                <Link href={`/admin/products/${r.product!.id}/edit`} className="text-foreground hover:text-accent">
                  {r.product!.name}
                </Link>
                <span className="shrink-0 text-foreground-muted">{r.count}×</span>
              </li>
            ))}
            {topProductRows.length === 0 && (
              <li className="text-sm text-foreground-subtle">No RFQ items yet</li>
            )}
          </ul>
        </div>

        {/* Top requested brands */}
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="mb-4 flex items-center gap-2">
            <Flag className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Top Requested Brands</h2>
          </div>
          <ul className="space-y-3">
            {topBrandRows.map(([name, count]) => (
              <li key={name} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-foreground">{name}</span>
                <span className="shrink-0 text-foreground-muted">{count}×</span>
              </li>
            ))}
            {topBrandRows.length === 0 && (
              <li className="text-sm text-foreground-subtle">No data yet</li>
            )}
          </ul>
        </div>

        {/* Countries */}
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Countries Originating RFQs</h2>
          </div>
          <ul className="space-y-3">
            {countriesAgg.map((c) => (
              <li key={c.country} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-foreground">{c.country}</span>
                <span className="shrink-0 text-foreground-muted">{c._count._all}×</span>
              </li>
            ))}
            {countriesAgg.length === 0 && (
              <li className="text-sm text-foreground-subtle">No RFQs yet</li>
            )}
          </ul>
        </div>
      </div>

      {/* Analytics grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Most viewed products */}
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="mb-4 flex items-center gap-2">
            <Eye className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Most Viewed Products</h2>
          </div>
          <ul className="space-y-3">
            {viewedRows.map((r) => (
              <li key={r.product!.id} className="flex items-center justify-between gap-3 text-sm">
                <Link href={`/admin/products/${r.product!.id}/edit`} className="text-foreground hover:text-accent">
                  {r.product!.name}
                </Link>
                <span className="shrink-0 text-foreground-muted">{r.count} views</span>
              </li>
            ))}
            {viewedRows.length === 0 && (
              <li className="text-sm text-foreground-subtle">No product views yet</li>
            )}
          </ul>
        </div>

        {/* Top search terms */}
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Top Search Terms</h2>
          </div>
          <ul className="space-y-3">
            {searchTermsAgg.map((s) => (
              <li key={s.query} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-foreground">&ldquo;{s.query}&rdquo;</span>
                <span className="shrink-0 text-foreground-muted">{s._count._all}×</span>
              </li>
            ))}
            {searchTermsAgg.length === 0 && (
              <li className="text-sm text-foreground-subtle">No searches yet</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}