"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { Checkbox, FormField, Input, Select, Textarea } from "@/components/ui/form";
import { generateRfqNumber } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export interface RfqModalProduct {
  id: string;
  name: string;
  quantity?: number;
}

interface RfqModalProps {
  open: boolean;
  onClose: () => void;
  product?: RfqModalProduct | null;
}

export function RfqModal({ open, onClose, product }: RfqModalProps) {
  const { t, locale } = useI18n();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    country: "",
    email: "",
    phone: "",
    quantity: "",
    targetPrice: "",
    preferredPackaging: "",
    deliveryDest: "",
    additionalReqs: "",
    message: "",
    preferredContact: "both",
    gdpr: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setSuccess(null);
      setError(null);
      setForm((f) => ({
        ...f,
        quantity: product?.quantity ? String(product.quantity) : f.quantity,
      }));
    }
  }, [open, product]);

  if (!open) return null;

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.fullName.trim()) errors.fullName = "Required";
    if (!form.companyName.trim()) errors.companyName = "Required";
    if (!form.country.trim()) errors.country = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Valid email required";
    if (!form.gdpr) errors.gdpr = "Required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/rfqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: form.quantity ? parseInt(form.quantity, 10) : undefined,
          productId: product?.id,
          rfqNumber: generateRfqNumber(),
          items: product
            ? [{ productId: product.id, quantity: parseInt(form.quantity || "0", 10) || undefined }]
            : [],
          locale,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to submit");
      }

      const data = await res.json();
      setSuccess(data.rfqNumber ?? "RFQ");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const setField = (key: string, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFormErrors((e) => {
      const { [key]: _, ...rest } = e;
      return rest;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-h-[90vh] overflow-y-auto rounded-t-xl bg-background p-6 sm:max-w-2xl sm:rounded-xl sm:p-8">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-foreground-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <span className="text-3xl text-success">✓</span>
            </div>
            <h2 className="font-serif text-2xl text-foreground">
              {t("rfq.success")}
            </h2>
            <p className="mt-3 text-sm text-foreground-muted">
              {t("rfq.successMessage")}
            </p>
            <p className="mt-4 text-sm font-medium text-accent">
              {t("rfq.successRfqNumber", { number: success })}
            </p>
            {product && (
              <p className="mt-2 text-xs text-foreground-muted">
                {product.name}
              </p>
            )}
            <Button className="mt-8" onClick={onClose}>
              {t("common.viewAll")}
            </Button>
          </div>
        ) : (
          <>
            <h2 className="font-serif text-2xl text-foreground">
              {t("rfq.title")}
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">
              {product ? product.name : t("rfq.subtitle")}
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label={t("rfq.fullName")} required error={formErrors.fullName}>
                  <Input
                    value={form.fullName}
                    onChange={(e) => setField("fullName", e.target.value)}
                  />
                </FormField>
                <FormField label={t("rfq.companyName")} required error={formErrors.companyName}>
                  <Input
                    value={form.companyName}
                    onChange={(e) => setField("companyName", e.target.value)}
                  />
                </FormField>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label={t("rfq.country")} required error={formErrors.country}>
                  <Input
                    value={form.country}
                    onChange={(e) => setField("country", e.target.value)}
                  />
                </FormField>
                <FormField label={t("rfq.email")} required error={formErrors.email}>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                  />
                </FormField>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label={t("rfq.phone")}>
                  <Input
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                  />
                </FormField>
                <FormField label={t("rfq.quantity")} required error={formErrors.quantity}>
                  <Input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setField("quantity", e.target.value)}
                    placeholder="e.g. 1000 or 5000"
                  />
                </FormField>
              </div>

              {!product && (
                <>
                  <FormField label={t("rfq.targetPrice")}>
                    <Input
                      value={form.targetPrice}
                      onChange={(e) => setField("targetPrice", e.target.value)}
                    />
                  </FormField>
                  <FormField label={t("rfq.preferredPackaging")}>
                    <Input
                      value={form.preferredPackaging}
                      onChange={(e) => setField("preferredPackaging", e.target.value)}
                    />
                  </FormField>
                  <FormField label={t("rfq.deliveryDestination")}>
                    <Input
                      value={form.deliveryDest}
                      onChange={(e) => setField("deliveryDest", e.target.value)}
                    />
                  </FormField>
                  <FormField label={t("rfq.additionalRequirements")}>
                    <Textarea
                      value={form.additionalReqs}
                      onChange={(e) => setField("additionalReqs", e.target.value)}
                    />
                  </FormField>
                </>
              )}

              <FormField label={t("rfq.message")}>
                <Textarea
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                />
              </FormField>

              <FormField label={t("rfq.preferredContact")}>
                <Select
                  value={form.preferredContact}
                  onChange={(e) => setField("preferredContact", e.target.value)}
                >
                  <option value="both">{t("rfq.preferContactBoth")}</option>
                  <option value="email">{t("rfq.preferContactEmail")}</option>
                  <option value="whatsapp">{t("rfq.preferContactWhatsApp")}</option>
                </Select>
              </FormField>

              <label className="flex items-start gap-2 text-xs text-foreground-muted">
                <Checkbox
                  checked={form.gdpr}
                  onChange={(e) => setField("gdpr", e.target.checked)}
                  className="mt-0.5"
                />
                <span>{t("rfq.gdpr")}</span>
              </label>
              {formErrors.gdpr && (
                <p className="text-xs text-error">Required</p>
              )}
              {error && <p className="text-sm text-error">{error}</p>}

              <Button variant="accent" size="lg" fullWidth type="submit" disabled={submitting}>
                {submitting ? t("rfq.submitting") : t("rfq.submit")}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
