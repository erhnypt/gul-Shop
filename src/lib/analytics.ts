import "server-only";
import prisma from "@/lib/prisma";

type AnalyticsEventType = "PRODUCT_VIEW" | "BRAND_VIEW" | "RFQ_CLICK" | "RFQ_SUBMIT" | "SEARCH" | "COMPARE";

export async function trackEvent(
  eventType: AnalyticsEventType,
  data: { productSlug?: string | null; brandSlug?: string | null; query?: string | null; locale?: string | null } = {}
) {
  // Fire-and-forget: never block page render or fail a request on analytics.
  try {
    await prisma.analyticsEvent.create({
      data: {
        eventType: eventType as any,
        productSlug: data.productSlug ?? null,
        brandSlug: data.brandSlug ?? null,
        query: data.query ? data.query.slice(0, 200) : null,
        locale: data.locale ?? null,
      },
    });
  } catch {
    // ignore analytics errors
  }
}