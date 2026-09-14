import { AdminProductForm } from "@/components/admin/admin-product-form";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function NewProductPage() {
  const [brands, functions, certifications] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.function.findMany({ orderBy: { name: "asc" } }),
    prisma.certification.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/admin/products" className="text-sm text-accent hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 font-serif text-2xl font-light text-foreground">New Product</h1>
      </div>
      <AdminProductForm
        brands={brands.map((b) => ({ id: b.id, name: b.name, slug: b.slug }))}
        functions={functions.map((f) => ({ id: f.id, name: f.name, slug: f.slug }))}
        certifications={certifications.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
      />
    </div>
  );
}
