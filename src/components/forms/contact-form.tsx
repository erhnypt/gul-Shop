"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { FormField, Input, Textarea, Checkbox } from "@/components/ui/form";
import { useState } from "react";

export function ContactForm({ locale }: { locale: string }) {
  const { t } = useI18n();
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    gdpr: false,
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-success/30 bg-success/5 p-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
          <span className="text-2xl text-success">✓</span>
        </div>
        <p className="text-foreground">{t("contact.enquiry.sent")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Name" required>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </FormField>
        <FormField label="Email" required>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </FormField>
      </div>
      <FormField label="Company">
        <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
      </FormField>
      <FormField label="Message" required>
        <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </FormField>
      <label className="flex items-start gap-2 text-xs text-foreground-muted">
        <Checkbox checked={form.gdpr} onChange={(e) => setForm({ ...form, gdpr: e.target.checked })} className="mt-0.5" />
        <span>{t("rfq.gdpr")}</span>
      </label>
      <Button variant="accent" type="submit" disabled={status === "sending"}>
        {status === "sending" ? t("rfq.submitting") : "Send Message"}
      </Button>
      {status === "error" && <p className="text-sm text-error">Something went wrong</p>}
    </form>
  );
}
