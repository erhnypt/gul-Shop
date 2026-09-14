import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({ orderBy: { title: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-light text-foreground">CMS Pages</h1>
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-foreground-subtle">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id} className="border-b border-border/60 hover:bg-surface/40">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-foreground-muted">/{p.slug}</td>
                <td className="px-4 py-3">{p.isPublished ? "Published" : "Draft"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/pages/${p.id}`} className="text-sm text-accent hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-foreground-subtle">No pages yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
