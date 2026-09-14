import { AdminSimpleManager } from "@/components/admin/admin-simple-manager";
import prisma from "@/lib/prisma";

export default async function AdminFunctionsPage() {
  const functions = await prisma.function.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-light text-foreground">Functions</h1>
      <p className="text-sm text-foreground-muted">
        Functions (e.g. Sun Protection, Acne Care) are managed through the admin to keep the catalog organized.
      </p>
      <AdminSimpleManager
        apiPath="/api/admin/functions"
        rows={functions.map((f) => ({ id: f.id, name: f.name, slug: f.slug, count: f._count.products }))}
      />
    </div>
  );
}
