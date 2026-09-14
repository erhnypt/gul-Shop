import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminRfqsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const status = sp.status ?? undefined;

  const validStatuses = ["NEW", "CONTACTED", "QUOTATION_SENT", "NEGOTIATION", "WON", "LOST", "ARCHIVED"] as const;
  const statusFilter = validStatuses.includes(status as any) ? (status as string) : undefined;

  const rfqs = await prisma.rFQ.findMany({
    where: statusFilter ? { status: statusFilter as any } : undefined,
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  const counts = await prisma.rFQ.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count._all]));

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-light text-foreground">RFQ Management</h1>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/rfqs"
          className={
            !statusFilter
              ? "rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background"
              : "rounded-full border border-border px-3 py-1 text-xs text-foreground-muted hover:bg-surface"
          }
        >
          All ({countMap.NEW + countMap.CONTACTED + countMap.QUOTATION_SENT + countMap.NEGOTIATION + countMap.WON + countMap.LOST + countMap.ARCHIVED || 0})
        </Link>
        {validStatuses.map((s) => (
          <Link
            key={s}
            href={`/admin/rfqs?status=${s}`}
            className={
              statusFilter === s
                ? "rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background"
                : "rounded-full border border-border px-3 py-1 text-xs text-foreground-muted hover:bg-surface"
            }
          >
            {s.replace(/_/g, " ")} ({countMap[s] ?? 0})
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-foreground-subtle">
                <th className="px-4 py-3">RFQ</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rfqs.map((rfq) => (
                <tr key={rfq.id} className="border-b border-border/60 hover:bg-surface/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/rfqs/${rfq.id}`} className="font-medium text-accent hover:underline">
                      {rfq.rfqNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">
                    {new Date(rfq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{rfq.fullName}</td>
                  <td className="px-4 py-3">{rfq.companyName}</td>
                  <td className="px-4 py-3">{rfq.country}</td>
                  <td className="px-4 py-3 text-foreground-muted">{rfq.items.length}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent-dark">
                      {rfq.status}
                    </span>
                  </td>
                </tr>
              ))}
              {rfqs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-foreground-subtle">
                    No RFQs{statusFilter ? ` with status ${statusFilter}` : ""} yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}