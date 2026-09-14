import { AdminFaqManager } from "@/components/admin/admin-faq-manager";
import prisma from "@/lib/prisma";

export default async function AdminFaqsPage() {
  const faqs = await prisma.fAQ.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, question: true, answer: true, sortOrder: true, isPublished: true },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-serif text-2xl font-light text-foreground">FAQs</h1>
      <p className="text-sm text-foreground-muted">
        Shown on the homepage FAQ section. Order ascending by sort order.
      </p>
      <AdminFaqManager faqs={faqs} />
    </div>
  );
}