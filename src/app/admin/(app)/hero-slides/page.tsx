import { AdminHeroManager } from "@/components/admin/admin-hero-manager";
import prisma from "@/lib/prisma";

export default async function AdminHeroSlidesPage() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, heading: true, description: true, imageUrl: true, ctaText: true, ctaLink: true, isActive: true, sortOrder: true },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-serif text-2xl font-light text-foreground">Hero Slides</h1>
      <p className="text-sm text-foreground-muted">
        Shown in the homepage hero slider (max 3 active). Order ascending by sort order.
      </p>
      <AdminHeroManager slides={slides} />
    </div>
  );
}