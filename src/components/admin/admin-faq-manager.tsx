"use client";

import { Button } from "@/components/ui/button";
import { FormField, Input, Textarea, Checkbox } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";

export interface AdminFaqRow {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
}

export function AdminFaqManager({ faqs }: { faqs: AdminFaqRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminFaqRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formDefault: AdminFaqRow = editing ?? {
    id: "",
    question: "",
    answer: "",
    sortOrder: 0,
    isPublished: true,
  };

  const [form, setForm] = useState<AdminFaqRow>(formDefault);

  const startNew = () => {
    setEditing(null);
    setError(null);
    setForm({ id: "", question: "", answer: "", sortOrder: faqs.length + 1, isPublished: true });
    setCreating(true);
  };

  const startEdit = (f: AdminFaqRow) => {
    setCreating(true);
    setError(null);
    setEditing(f);
    setForm({ ...f });
  };

  const cancel = () => {
    setCreating(false);
    setEditing(null);
    setForm({ id: "", question: "", answer: "", sortOrder: 0, isPublished: true });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/faqs", {
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
    if (!confirm("Delete this FAQ?")) return;
    const res = await fetch(`/api/admin/faqs?id=${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {!creating && (
          <Button onClick={startNew} type="button" size="sm">
            + New FAQ
          </Button>
        )}
      </div>

      {creating && (
        <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-background p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">{editing ? "Edit FAQ" : "New FAQ"}</h2>
            <button onClick={cancel} aria-label="Close" className="text-foreground-subtle hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <FormField label="Question" required>
            <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          </FormField>
          <FormField label="Answer" required>
            <Textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Sort Order">
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })}
              />
            </FormField>
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            Published
          </label>
          {error && <p className="text-sm text-error">{error}</p>}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : editing ? "Save Changes" : "Create FAQ"}
          </Button>
        </form>
      )}

      <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-background">
        {faqs.map((f) => (
          <div key={f.id} className="flex items-start justify-between gap-4 p-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-foreground">{f.question}</span>
                {!f.isPublished && (
                  <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs text-foreground-muted">Draft</span>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-foreground-muted">{f.answer}</p>
              <p className="mt-1 text-xs text-foreground-subtle">Order: {f.sortOrder}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={() => startEdit(f)} aria-label="Edit" className="text-foreground-subtle hover:text-accent">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => del(f.id)} aria-label="Delete" className="text-foreground-subtle hover:text-error">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && !creating && (
          <p className="p-8 text-center text-foreground-subtle">No FAQs yet. Create your first one.</p>
        )}
      </div>
    </div>
  );
}