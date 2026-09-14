import prisma from "@/lib/prisma";
import { RfqDetailClient } from "@/components/admin/rfq-detail-client";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AdminRfqDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rfq = await prisma.rFQ.findUnique({
    where: { id },
    include: {
      items: { include: { product: { include: { brand: true } } } },
      notes: true,
    },
  });

  if (!rfq) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Link href="/admin/rfqs" className="text-sm text-accent hover:underline">
          ← All RFQs
        </Link>
        <div className="mt-2 flex items-center gap-4">
          <h1 className="font-serif text-2xl font-light text-foreground">{rfq.rfqNumber}</h1>
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent-dark">{rfq.status}</span>
        </div>
        <p className="mt-1 text-sm text-foreground-muted">
          Submitted {new Date(rfq.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Buyer info */}
        <div className="rounded-lg border border-border bg-background p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">Buyer Information</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-foreground-muted">Name</dt><dd>{rfq.fullName}</dd></div>
            <div className="flex justify-between"><dt className="text-foreground-muted">Company</dt><dd>{rfq.companyName}</dd></div>
            <div className="flex justify-between"><dt className="text-foreground-muted">Country</dt><dd>{rfq.country}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-foreground-muted shrink-0">Email</dt><dd className="break-all">{rfq.email}</dd></div>
            <div className="flex justify-between"><dt className="text-foreground-muted">Phone</dt><dd>{rfq.phone || rfq.whatsapp || "-"}</dd></div>
            <div className="flex justify-between"><dt className="text-foreground-muted">Preferred Contact</dt><dd>{rfq.preferredContact}</dd></div>
            <div className="flex justify-between"><dt className="text-foreground-muted">Destination</dt><dd>{rfq.deliveryDest || "-"}</dd></div>
            <div className="flex justify-between"><dt className="text-foreground-muted">Target Price</dt><dd>{rfq.targetPrice || "-"}</dd></div>
          </dl>
        </div>

        {/* RFQ items */}
        <div className="rounded-lg border border-border bg-background p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
            Products ({rfq.items.length})
          </h2>
          <div className="space-y-3">
            {rfq.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-border/60 pb-2 text-sm">
                <Link href={`/products/${item.product.slug}`} className="font-medium text-accent hover:underline">
                  {item.product.name}
                </Link>
                <span className="text-foreground-muted">
                  {item.quantity ? `${item.quantity} units` : "Qty on request"}
                </span>
              </div>
            ))}
          </div>
          {rfq.message && (
            <div className="mt-4">
              <p className="mb-1 text-xs text-foreground-subtle">Message</p>
              <p className="whitespace-pre-line text-sm text-foreground-muted">{rfq.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Internal notes */}
      <div className="rounded-lg border border-border bg-background p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">Internal Notes</h2>
        {rfq.notes.length > 0 && (
          <ul className="mb-4 space-y-2">
            {rfq.notes.map((n) => (
              <li key={n.id} className="rounded-md bg-surface/60 p-3 text-sm">
                <p className="text-foreground">{n.content}</p>
                <p className="mt-1 text-xs text-foreground-subtle">{new Date(n.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <RfqDetailClient id={rfq.id} currentStatus={rfq.status} />
    </div>
  );
}
