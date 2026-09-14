"use client";

import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SettingsForm({
  initial,
}: {
  initial: Record<string, string | null>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(initial).map(([k, v]) => [k, v ?? ""]))
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const field = (k: string, label: string, type = "text") => (
    <FormField label={label}>
      <Input type={type} value={form[k] ?? ""} onChange={(e) => set(k, e.target.value)} />
    </FormField>
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      setMsg("Saved.");
      router.refresh();
    } catch {
      setMsg("Error saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="space-y-4 rounded-lg border border-border bg-background p-5">
        <h2 className="text-lg font-medium text-foreground">Brand & Contact</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("siteName", "Site Name")}
          {field("siteDescription", "Site Description")}
          {field("logoUrl", "Logo URL")}
          {field("salesEmail", "Sales Email", "email")}
          {field("generalEmail", "General Email", "email")}
          {field("supportEmail", "Support Email", "email")}
          {field("whatsappNumber", "WhatsApp Number")}
          {field("phone", "Phone")}
          {field("address", "Address")}
          {field("businessHours", "Business Hours")}
          {field("facebook", "Facebook URL")}
          {field("instagram", "Instagram URL")}
          {field("linkedin", "LinkedIn URL")}
        </div>
      </section>
      {msg && <p className="text-sm text-foreground-muted">{msg}</p>}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
