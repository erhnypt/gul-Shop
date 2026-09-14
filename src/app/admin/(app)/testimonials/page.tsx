import { AdminTestimonialManager } from "@/components/admin/admin-testimonial-manager";
import prisma from "@/lib/prisma";

export const metadata = { title: "Testimonials — Admin" };

export default async function AdminTestimonialsPage() {
  const items = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-light text-foreground">Testimonials</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Only verified testimonials are shown on the public site. Never add fake customer quotes.
        </p>
      </div>
      <AdminTestimonialManager
        items={items.map((t) => ({
          id: t.id,
          name: t.name,
          role: t.role,
          companyName: t.companyName,
          country: t.country,
          quote: t.quote,
          rating: t.rating,
          isVerified: t.isVerified,
          sortOrder: t.sortOrder,
          isActive: t.isActive,
        }))}
      />
    </div>
  );
}