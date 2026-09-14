import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const query = sp.q ?? "";
  const products = await prisma.product.findMany({
    where: query
      ? { name: { contains: query, mode: "insensitive" } }
      : undefined,
    include: { brand: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-light text-foreground">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90"
        >
          <Plus className="h-4 w-4" /> New Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-foreground-subtle">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">MOQ</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Featured</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border/60 hover:bg-surface/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${p.id}/edit`} className="font-medium text-foreground hover:text-accent">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">{p.brand.name}</td>
                  <td className="px-4 py-3 text-foreground-muted">{p.productType ?? "-"}</td>
                  <td className="px-4 py-3 text-foreground-muted">{p.moq ? `${p.moq} units` : "Contact us"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        p.status === "PUBLISHED"
                          ? "rounded-full bg-success/10 px-2 py-0.5 text-xs text-success"
                          : p.status === "DRAFT"
                          ? "rounded-full bg-warning/10 px-2 py-0.5 text-xs text-warning"
                          : "rounded-full bg-foreground/10 px-2 py-0.5 text-xs text-foreground-muted"
                      }
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">{p.isFeatured ? "★" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
