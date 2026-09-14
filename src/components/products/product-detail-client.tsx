"use client";

import { RfqModal, type RfqModalProduct } from "@/components/rfq/rfq-modal";
import { ProductGallery } from "@/components/products/product-gallery";
import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRfqStore } from "@/lib/rfq-store";
import { trackClientEvent } from "@/lib/analytics-client";
import { getWhatsAppLink, cn } from "@/lib/utils";
import { ClipboardPlus, MessageCircle, Check, FileText, Lock, Download } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export interface DetailProduct {
  id: string;
  name: string;
  slug: string;
  productType: string | null;
  shortDescription: string | null;
  description: string | null;
  benefits: string | null;
  ingredients: string | null;
  skinType: string | null;
  packaging: string | null;
  size: string | null;
  moq: number | null;
  moqNote: string | null;
  cartonQuantity: number | null;
  unitsPerCarton: number | null;
  shelfLife: string | null;
  countryOfOrigin: string;
  leadTime: string | null;
  sampleAvailable: boolean;
  oemOdmAvailable: boolean;
  brand: { name: string; slug: string };
  certifications: { certification: { id: string; name: string; slug: string } }[];
  documents: { name: string; url: string; type: string; access: string }[];
  whatsapp: string | null;
  image: string | null;
  images: { url: string; alt: string | null }[];
}

export function ProductDetailClient({ product }: { product: DetailProduct }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const addItem = useRfqStore((s) => s.addItem);
  const [modalProduct, setModalProduct] = useState<RfqModalProduct | null>(null);
  const [added, setAdded] = useState(false);
  const open = searchParams.get("rfq") === "1";

  useEffect(() => {
    if (open) setModalProduct({ id: product.id, name: product.name, quantity: product.moq ?? undefined });
    else setModalProduct(null);
  }, [open, product.id, product.name, product.moq]);

  const addToRfq = () => {
    if (!added) {
      addItem({
        productId: product.id,
        name: product.name,
        brandName: product.brand.name,
        image: product.image,
        slug: product.slug,
        quantity: product.moq ?? 1000,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const waMessage = `Hello, I am interested in the wholesale supply of ${product.name}. Please provide MOQ and wholesale pricing.`;

  const infoItems = [
    { label: "Product Type", value: product.productType },
    { label: t("common.skinType"), value: product.skinType },
    { label: t("common.packaging"), value: product.packaging },
    { label: t("common.availableSizes"), value: product.size },
    { label: t("common.shelfLife"), value: product.shelfLife },
    { label: t("common.countryOfOrigin"), value: product.countryOfOrigin },
    { label: t("common.leadTime"), value: product.leadTime },
  ].filter((i) => i.value);

  const wholesaleItems = [
    { label: t("common.moq"), value: product.moq ? `${product.moq} units` : t("common.moqContact") },
    { label: t("common.cartonQuantity"), value: product.cartonQuantity ? String(product.cartonQuantity) : null },
    { label: t("common.unitsPerCarton"), value: product.unitsPerCarton ? String(product.unitsPerCarton) : null },
    { label: t("common.sampleAvailability"), value: product.sampleAvailable ? "Yes" : "On request" },
    { label: t("common.privateLabel"), value: product.oemOdmAvailable ? "Available" : "On request" },
    { label: t("common.oemOdm"), value: product.oemOdmAvailable ? "Available" : "On request" },
  ].filter((i) => i.value);

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Info */}
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            {product.brand.name}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-light text-foreground lg:text-4xl">
            {product.name}
          </h1>
          {product.productType && (
            <p className="mt-2 text-sm text-foreground-muted">{product.productType}</p>
          )}

          {product.shortDescription && (
            <p className="mt-4 text-base leading-relaxed text-foreground-muted">
              {product.shortDescription}
            </p>
          )}

          {product.certifications.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.certifications.map((c) => (
                <Badge key={c.certification.id} variant="accent">
                  {c.certification.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Availability + MOQ banner */}
          <div className="mt-6 rounded-lg border border-border bg-surface/60 p-5">
            <p className="text-sm font-medium text-foreground">
              {t("common.moq")}:{" "}
              <span className="font-semibold text-accent-dark">
                {product.moq ? `${product.moq} units` : t("common.moqContact")}
              </span>
            </p>
            <p className="mt-2 text-sm text-foreground-muted">
              {t("common.wholesalePricingOnRequest")}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="accent"
              size="lg"
              onClick={() => {
                trackClientEvent("RFQ_CLICK", { productSlug: product.slug, locale });
                router.push(`/${locale}/products/${product.slug}?rfq=1`, { scroll: false });
              }}
            >
              {t("product.requestQuote")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={addToRfq}
              className={cn(added && "border-success text-success")}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Added
                </>
              ) : (
                <>
                  <ClipboardPlus className="h-4 w-4" /> {t("common.addToRfq")}
                </>
              )}
            </Button>
            {product.whatsapp && (
              <a
                href={getWhatsAppLink(product.whatsapp, waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-md px-6 text-sm font-medium text-white transition-colors hover:opacity-90 bg-[#25D366]"
              >
                <MessageCircle className="h-4 w-4" /> {t("common.chatOnWhatsApp")}
              </a>
            )}
          </div>

          {/* Specifications */}
          <div className="mt-8 border-t border-border pt-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
              {t("common.specifications")}
            </h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              {infoItems.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs text-foreground-subtle">{item.label}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-foreground">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Wholesale info */}
          <div className="mt-8 border-t border-border pt-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
              {t("common.wholesaleInformation")}
            </h2>
            <dl className="space-y-2">
              {wholesaleItems.map((item) => (
                <div key={item.label} className="flex justify-between border-b border-border/60 py-2 text-sm">
                  <dt className="text-foreground-muted">{item.label}</dt>
                  <dd className="font-medium text-foreground">{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-foreground-muted">
              {t("common.contactForPricing")}
            </p>
          </div>

          {/* Documents & Downloads */}
          {(() => {
            const publicDocs = product.documents.filter((d) => d.access === "public");
            const rfqDocs = product.documents.filter((d) => d.access === "after_rfq");
            if (publicDocs.length === 0 && rfqDocs.length === 0) return null;
            return (
              <div className="mt-8 border-t border-border pt-6">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
                  Documents & Downloads
                </h2>
                <ul className="space-y-2">
                  {publicDocs.map((doc, i) => (
                    <li key={i}>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 rounded-md border border-border px-4 py-3 text-sm transition-colors hover:border-accent"
                      >
                        <span className="flex items-center gap-2 text-foreground">
                          <FileText className="h-4 w-4 text-accent" />
                          {doc.name}
                        </span>
                        <Download className="h-4 w-4 text-foreground-subtle" />
                      </a>
                    </li>
                  ))}
                  {rfqDocs.map((doc, i) => (
                    <li key={i}>
                      <button
                        onClick={() => {
                          trackClientEvent("RFQ_CLICK", { productSlug: product.slug, locale });
                          router.push(`/${locale}/products/${product.slug}?rfq=1`, { scroll: false });
                        }}
                        className="flex w-full items-center justify-between gap-3 rounded-md border border-dashed border-border px-4 py-3 text-left text-sm transition-colors hover:border-accent"
                      >
                        <span className="flex items-center gap-2 text-foreground-muted">
                          <Lock className="h-4 w-4 text-accent" />
                          {doc.name}
                        </span>
                        <span className="shrink-0 text-xs text-foreground-subtle">
                          Unlock with RFQ
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}

          {/* Benefits */}
          {product.benefits && (
            <div className="mt-8 border-t border-border pt-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
                {t("common.benefits")}
              </h2>
              <p className="text-sm leading-relaxed text-foreground-muted">{product.benefits}</p>
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients && (
            <div className="mt-8 border-t border-border pt-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
                {t("common.ingredients")}
              </h2>
              <p className="text-sm leading-relaxed text-foreground-muted">{product.ingredients}</p>
            </div>
          )}
        </div>
      </div>

      <RfqModal
        open={!!modalProduct}
        onClose={() => router.replace(`/${locale}/products/${product.slug}`, { scroll: false })}
        product={modalProduct}
      />
    </>
  );
}
