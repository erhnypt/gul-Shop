"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { Input, Textarea, FormField, Checkbox } from "@/components/ui/form";
import { generateRfqNumber } from "@/lib/utils";
import { useState } from "react";

export function RequestQuoteClient() {
  const { t, locale } = useI18n();
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    country: "",
    email: "",
    whatsapp: "",
    productInterests: "",
    estimatedQuantity: "",
    productCategories: "",
    destinationPort: "",
    certificationsRequired: "",
    message: "",
    preferredContact: "both",
    gdpr: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.gdpr) {
      setError(t("rfq.gdpr"));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/rfqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rfqNumber: generateRfqNumber(),
          phone: form.whatsapp,
          message: [
            form.productInterests && `Interests: ${form.productInterests}`,
            form.estimatedQuantity && `Est. Qty: ${form.estimatedQuantity}`,
            form.productCategories && `Categories: ${form.productCategories}`,
            form.destinationPort && `Destination: ${form.destinationPort}`,
            form.certificationsRequired && `Certs: ${form.certificationsRequired}`,
            form.message,
          ]
            .filter(Boolean)
            .join("\n"),
          locale,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed");
      }
      const data = await res.json();
      setSuccess(data.rfqNumber ?? "RFQ");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <span className="text-3xl text-success">✓</span>
        </div>
        <h1 className="font-serif text-2xl text-foreground">{t("rfq.success")}</h1>
        <p className="mt-3 text-sm text-foreground-muted">{t("rfq.successMessage")}</p>
        <p className="mt-4 font-medium text-accent">
          {t("rfq.successRfqNumber", { number: success })}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-light text-foreground">{t("rfq.title")}</h1>
      <p className="mt-2 text-foreground-muted">{t("rfq.subtitle")}</p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label={t("rfq.fullName")} required>
            <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </FormField>
          <FormField label={t("rfq.companyName")} required>
            <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          </FormField>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label={t("rfq.country")} required>
            <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </FormField>
          <FormField label={t("rfq.email")} required>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormField>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label={t("rfq.phone")}>
            <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          </FormField>
          <FormField label={t("rfq.productInterests")}>
            <Input value={form.productInterests} onChange={(e) => setForm({ ...form, productInterests: e.target.value })} />
          </FormField>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label={t("rfq.estimatedOrderQuantity")}>
            <Input value={form.estimatedQuantity} onChange={(e) => setForm({ ...form, estimatedQuantity: e.target.value })} />
          </FormField>
          <FormField label={t("rfq.productCategories")}>
            <Input value={form.productCategories} onChange={(e) => setForm({ ...form, productCategories: e.target.value })} />
          </FormField>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label={t("rfq.destinationPort")}>
            <Input value={form.destinationPort} onChange={(e) => setForm({ ...form, destinationPort: e.target.value })} />
          </FormField>
          <FormField label={t("rfq.certificationsRequired")}>
            <Input value={form.certificationsRequired} onChange={(e) => setForm({ ...form, certificationsRequired: e.target.value })} />
          </FormField>
        </div>
        <FormField label={t("rfq.message")}>
          <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </FormField>

        <FormField label={t("rfq.preferredContact")}>
          <select
            value={form.preferredContact}
            onChange={(e) => setForm({ ...form, preferredContact: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          >
            <option value="both">{t("rfq.preferContactBoth")}</option>
            <option value="email">{t("rfq.preferContactEmail")}</option>
            <option value="whatsapp">{t("rfq.preferContactWhatsApp")}</option>
          </select>
        </FormField>

        <label className="flex items-start gap-2 text-xs text-foreground-muted">
          <Checkbox checked={form.gdpr} onChange={(e) => setForm({ ...form, gdpr: e.target.checked })} className="mt-0.5" />
          <span>{t("rfq.gdpr")}</span>
        </label>
        {error && <p className="text-sm text-error">{error}</p>}

        <Button variant="accent" size="lg" fullWidth type="submit" disabled={submitting}>
          {submitting ? t("rfq.submitting") : t("rfq.submit")}
        </Button>
      </form>
    </div>
  );
}
