import { AdminSimpleManager } from "@/components/admin/admin-simple-manager";
import prisma from "@/lib/prisma";

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-light text-foreground">Brands</h1>
      <AdminSimpleManager
        apiPath="/api/admin/brands"
        rows={brands.map((b) => ({ id: b.id, name: b.name, slug: b.slug, count: b._count.products }))}
      />
    </div>
  );
}
