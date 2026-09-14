import { AdminSimpleManager } from "@/components/admin/admin-simple-manager";
import prisma from "@/lib/prisma";

export default async function AdminCertificationsPage() {
  const certs = await prisma.certification.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-light text-foreground">Certifications</h1>
      <AdminSimpleManager
        apiPath="/api/admin/certifications"
        rows={certs.map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: c._count.products }))}
      />
    </div>
  );
}
