"use client";

export function trackClientEvent(
  eventType: "RFQ_CLICK" | "COMPARE",
  data: { productSlug?: string | null; locale?: string | null } = {}
) {
  try {
    if (typeof navigator === "undefined") return;
    navigator.sendBeacon(
      `/api/analytics?event=${eventType}&productSlug=${encodeURIComponent(data.productSlug ?? "")}&locale=${encodeURIComponent(data.locale ?? "")}`
    );
  } catch {
    // ignore
  }
}