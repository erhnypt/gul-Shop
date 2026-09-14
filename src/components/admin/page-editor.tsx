"use client";

import { Button } from "@/components/ui/button";
import { FormField, Input, Textarea, Checkbox } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PageEditor({
  id,
  initial,
}: {
  id: string;
  initial: { title: string; slug: string; content: string; seoTitle: string; seoDesc: string; isPublished: boolean };
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const set = (patch: Partial<typeof initial>) => setForm((f) => ({ ...f, ...patch }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
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
    <form onSubmit={submit} className="space-y-4">
      <FormField label="Title" required>
        <Input value={form.title} onChange={(e) => set({ title: e.target.value })} />
      </FormField>
      <FormField label="Slug" required>
        <Input value={form.slug} onChange={(e) => set({ slug: e.target.value })} />
      </FormField>
      <FormField label="SEO Title">
        <Input value={form.seoTitle} onChange={(e) => set({ seoTitle: e.target.value })} />
      </FormField>
      <FormField label="SEO Description">
        <Input value={form.seoDesc} onChange={(e) => set({ seoDesc: e.target.value })} />
      </FormField>
      <FormField label="Content (supports paragraphs, plain text / HTML)">
        <Textarea value={form.content} onChange={(e) => set({ content: e.target.value })} rows={14} />
      </FormField>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <Checkbox checked={form.isPublished} onChange={(e) => set({ isPublished: e.target.checked })} />
        Published
      </label>
      {msg && <p className="text-sm text-foreground-muted">{msg}</p>}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Page"}
      </Button>
    </form>
  );
}
