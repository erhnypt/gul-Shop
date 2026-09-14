"use client";

import { Button } from "@/components/ui/button";
import { FormField, Input, Textarea, Checkbox } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2, X, Star } from "lucide-react";

export interface AdminTestimonial {
  id: string;
  name: string;
  role: string | null;
  companyName: string | null;
  country: string | null;
  quote: string;
  rating: number;
  isVerified: boolean;
  sortOrder: number;
  isActive: boolean;
}

const blank = (order: number): AdminTestimonial => ({
  id: "",
  name: "",
  role: null,
  companyName: null,
  country: null,
  quote: "",
  rating: 5,
  isVerified: true,
  sortOrder: order,
  isActive: true,
});

export function AdminTestimonialManager({ items }: { items: AdminTestimonial[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminTestimonial | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AdminTestimonial>(blank(1));
  const [error, setError] = useState<string | null>(null);

  const startNew = () => {
    setEditing(null);
    setError(null);
    setForm(blank(items.length + 1));
    setCreating(true);
  };

  const startEdit = (t: AdminTestimonial) => {
    setCreating(true);
    setError(null);
    setEditing(t);
    setForm({ ...t });
  };

  const cancel = () => {
    setCreating(false);
    setEditing(null);
    setForm(blank(1));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/testimonials", {
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
    if (!confirm("Delete this testimonial?")) return;
    const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {!creating && (
          <Button onClick={startNew} type="button" size="sm">
            + New Testimonial
          </Button>
        )}
      </div>

      {creating && (
        <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-background p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">{editing ? "Edit Testimonial" : "New Testimonial"}</h2>
            <button onClick={cancel} aria-label="Close" className="text-foreground-subtle hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Name" required>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </FormField>
            <FormField label="Role / Title">
              <Input value={form.role ?? ""} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Procurement Manager" />
            </FormField>
            <FormField label="Company">
              <Input value={form.companyName ?? ""} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            </FormField>
            <FormField label="Country">
              <Input value={form.country ?? ""} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Quote" required>
            <Textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={4} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Rating (1-5)">
              <Input
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Math.max(1, Math.min(5, Number(e.target.value) || 5)) })}
              />
            </FormField>
            <FormField label="Sort Order">
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })}
              />
            </FormField>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox checked={form.isVerified} onChange={(e) => setForm({ ...form, isVerified: e.target.checked })} />
              Verified (only verified testimonials shown publicly)
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Active
            </label>
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : editing ? "Save Changes" : "Create Testimonial"}
          </Button>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border border-border bg-background">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-foreground-subtle">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-foreground-subtle">
                  No testimonials yet. Add a verified buyer testimonial.
                </td>
              </tr>
            )}
            {items.map((t) => (
              <tr key={t.id} className="border-b border-border/60 hover:bg-surface/40">
                <td className="px-4 py-3 font-medium text-foreground">{t.name}</td>
                <td className="px-4 py-3 text-foreground-muted">{t.companyName ?? "—"}</td>
                <td className="px-4 py-3 text-foreground-muted">{t.country ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-0.5 text-warning">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">
                  {t.isActive && t.isVerified ? (
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-success">Verified</span>
                  ) : (
                    <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-foreground-muted">Hidden</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => startEdit(t)} aria-label="Edit" className="p-1 text-foreground-muted hover:text-accent">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => del(t.id)} aria-label="Delete" className="p-1 text-foreground-muted hover:text-error">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}