import { NextRequest, NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";

const ALLOWED = new Set(["RFQ_CLICK", "COMPARE"]);

export async function GET(req: NextRequest) {
  const event = req.nextUrl.searchParams.get("event") ?? "";
  if (!ALLOWED.has(event)) return new NextResponse(null, { status: 400 });
  const productSlug = req.nextUrl.searchParams.get("productSlug") || null;
  const locale = req.nextUrl.searchParams.get("locale") || null;
  await trackEvent(event as "RFQ_CLICK", { productSlug, locale });
  return new NextResponse(null, { status: 204 });
}