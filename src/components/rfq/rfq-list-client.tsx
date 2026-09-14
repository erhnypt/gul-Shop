"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { Input, Textarea, FormField } from "@/components/ui/form";
import { useRfqStore } from "@/lib/rfq-store";
import { generateRfqNumber } from "@/lib/utils";
import Link from "next/link";
import { ClipboardList, Trash2 } from "lucide-react";
import { useState } from "react";

export function RfqListClient() {
  const { t, locale } = useI18n();
  const { items, removeItem, updateQuantity, updateNote, clear, closeList } = useRfqStore();
  const [details, setDetails] = useState({
    fullName: "",
    companyName: "",
    country: "",
    email: "",
    phone: "",
    message: "",
    preferredContact: "both",
    gdpr: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
        <ClipboardList className="mb-4 h-12 w-12 text-foreground-subtle" />
        <h1 className="font-serif text-2xl text-foreground">{t("rfq.listEmpty")}</h1>
        <p className="mt-2 max-w-sm text-sm text-foreground-muted">
          {t("rfq.listEmptyDesc")}
        </p>
        <Link
          href={`/${locale}/products`}
          className="mt-6 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background"
        >
          {t("common.exploreProducts")}
        </Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (details.gdpr === false) {
      setError(t("rfq.gdpr"));
      return;
    }
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/rfqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...details,
          rfqNumber: generateRfqNumber(),
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity || undefined,
            note: i.note,
          })),
          locale,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed");
      }
      const data = await res.json();
      setSuccess(data.rfqNumber ?? "RFQ");
      clear();
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <span className="text-3xl text-success">✓</span>
        </div>
        <h1 className="font-serif text-2xl text-foreground">{t("rfq.success")}</h1>
        <p className="mt-3 text-sm text-foreground-muted">{t("rfq.successMessage")}</p>
        <p className="mt-4 font-medium text-accent">
          {t("rfq.successRfqNumber", { number: success })}
        </p>
        <Link
          href={`/${locale}/products`}
          className="mt-8 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background"
        >
          {t("common.exploreProducts")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">
            {t("rfq.listTitle")} ({items.length})
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">{t("rfq.listSubtitle")}</p>
        </div>
        <button onClick={clear} className="text-sm text-foreground-subtle hover:text-error">
          {t("rfq.clearList")}
        </button>
      </div>

      <form onSubmit={submit} className="grid gap-10 lg:grid-cols-5">
        {/* Items */}
        <div className="space-y-4 lg:col-span-3">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 border border-border p-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden border border-border bg-surface">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center font-serif text-foreground-subtle">
                    {item.brandName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-accent">{item.brandName}</p>
                <Link
                  href={`/${locale}/products/${item.slug}`}
                  className="font-serif text-lg text-foreground hover:text-accent-dark"
                >
                  {item.name}
                </Link>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-foreground-subtle">{t("rfq.quantity")}</label>
                    <Input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                      className="w-28"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-foreground-subtle hover:text-error"
                    aria-label={t("rfq.remove")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2">
                  <Textarea
                    value={item.note ?? ""}
                    onChange={(e) => updateNote(item.productId, e.target.value)}
                    placeholder={t("rfq.addNote")}
                    className="min-h-[50px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Buyer details */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-lg border border-border bg-surface/50 p-5">
            <h2 className="mb-4 font-serif text-xl text-foreground">{t("rfq.rfqList")}</h2>
            <div className="space-y-4">
              <FormField label={t("rfq.fullName")} required>
                <Input
                  value={details.fullName}
                  onChange={(e) => setDetails({ ...details, fullName: e.target.value })}
                />
              </FormField>
              <FormField label={t("rfq.companyName")} required>
                <Input
                  value={details.companyName}
                  onChange={(e) => setDetails({ ...details, companyName: e.target.value })}
                />
              </FormField>
              <FormField label={t("rfq.country")} required>
                <Input
                  value={details.country}
                  onChange={(e) => setDetails({ ...details, country: e.target.value })}
                />
              </FormField>
              <FormField label={t("rfq.email")} required>
                <Input
                  type="email"
                  value={details.email}
                  onChange={(e) => setDetails({ ...details, email: e.target.value })}
                />
              </FormField>
              <FormField label={t("rfq.phone")}>
                <Input
                  value={details.phone}
                  onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                />
              </FormField>
              <FormField label={t("rfq.message")}>
                <Textarea
                  value={details.message}
                  onChange={(e) => setDetails({ ...details, message: e.target.value })}
                />
              </FormField>
              <FormField label={t("rfq.preferredContact")}>
                <select
                  value={details.preferredContact}
                  onChange={(e) => setDetails({ ...details, preferredContact: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                >
                  <option value="both">{t("rfq.preferContactBoth")}</option>
                  <option value="email">{t("rfq.preferContactEmail")}</option>
                  <option value="whatsapp">{t("rfq.preferContactWhatsApp")}</option>
                </select>
              </FormField>
              <label className="flex items-start gap-2 text-xs text-foreground-muted">
                <input
                  type="checkbox"
                  checked={details.gdpr}
                  onChange={(e) => setDetails({ ...details, gdpr: e.target.checked })}
                  className="mt-0.5"
                />
                <span>{t("rfq.gdpr")}</span>
              </label>
              {error && <p className="text-sm text-error">{error}</p>}
              <Button variant="accent" size="lg" fullWidth type="submit" disabled={submitting}>
                {submitting ? t("rfq.submitting") : t("rfq.submitSelected")}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
