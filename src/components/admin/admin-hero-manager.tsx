"use client";

import { Button } from "@/components/ui/button";
import { FormField, Input, Textarea, Checkbox } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";

export interface AdminHeroRow {
  id: string;
  heading: string;
  description: string | null;
  imageUrl: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  isActive: boolean;
  sortOrder: number;
}

export function AdminHeroManager({ slides }: { slides: AdminHeroRow[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminHeroRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const empty: AdminHeroRow = {
    id: "",
    heading: "",
    description: "",
    imageUrl: "",
    ctaText: "",
    ctaLink: "",
    isActive: true,
    sortOrder: slides.length + 1,
  };

  const [form, setForm] = useState<AdminHeroRow>(empty);

  const startNew = () => {
    setCreating(true);
    setEditing(null);
    setError(null);
    setForm(empty);
  };

  const startEdit = (s: AdminHeroRow) => {
    setCreating(true);
    setEditing(s);
    setError(null);
    setForm({ ...s, description: s.description ?? "", imageUrl: s.imageUrl ?? "", ctaText: s.ctaText ?? "", ctaLink: s.ctaLink ?? "" });
  };

  const cancel = () => {
    setCreating(false);
    setEditing(null);
    setForm(empty);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      cancel();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this slide?")) return;
    const res = await fetch(`/api/admin/hero-slides?id=${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {!creating && (
          <Button onClick={startNew} type="button" size="sm">
            + New Slide
          </Button>
        )}
      </div>

      {creating && (
        <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-background p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">{editing ? "Edit Slide" : "New Slide"}</h2>
            <button onClick={cancel} aria-label="Close" className="text-foreground-subtle hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <FormField label="Heading" required>
            <Input value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
          </FormField>
          <FormField label="Description">
            <Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </FormField>
          <FormField label="Image URL">
            <Input value={form.imageUrl ?? ""} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="CTA Text">
              <Input value={form.ctaText ?? ""} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} />
            </FormField>
            <FormField label="CTA Link">
              <Input value={form.ctaLink ?? ""} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} placeholder="/en/products" />
            </FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Sort Order">
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })}
              />
            </FormField>
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Active (shown on homepage)
          </label>
          {error && <p className="text-sm text-error">{error}</p>}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : editing ? "Save Changes" : "Create Slide"}
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {slides.map((s) => (
          <div key={s.id} className="flex items-start justify-between gap-4 rounded-lg border border-border bg-background p-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-foreground">{s.heading}</span>
                {!s.isActive && (
                  <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs text-foreground-muted">Inactive</span>
                )}
                {s.imageUrl && (
                  <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-foreground-muted">has image</span>
                )}
              </div>
              {s.description && <p className="mt-1 line-clamp-2 text-sm text-foreground-muted">{s.description}</p>}
              <p className="mt-1 text-xs text-foreground-subtle">Order: {s.sortOrder}{s.ctaLink ? ` · CTA → ${s.ctaLink}` : ""}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={() => startEdit(s)} aria-label="Edit" className="text-foreground-subtle hover:text-accent">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => del(s.id)} aria-label="Delete" className="text-foreground-subtle hover:text-error">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {slides.length === 0 && !creating && (
          <p className="rounded-lg border border-border p-8 text-center text-foreground-subtle">
            No hero slides yet. Create your first one.
          </p>
        )}
      </div>
    </div>
  );
}