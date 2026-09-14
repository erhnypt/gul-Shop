import { PageEditor } from "@/components/admin/page-editor";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AdminPageEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/admin/pages" className="text-sm text-accent hover:underline">← All Pages</Link>
        <h1 className="mt-2 font-serif text-2xl font-light text-foreground">Edit Page</h1>
      </div>
      <PageEditor
        id={page.id}
        initial={{
          title: page.title,
          slug: page.slug,
          content: page.content ?? "",
          seoTitle: page.seoTitle ?? "",
          seoDesc: page.seoDesc ?? "",
          isPublished: page.isPublished,
        }}
      />
    </div>
  );
}
