"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export interface ManagerRow {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export function AdminSimpleManager({
  apiPath,
  rows,
}: {
  apiPath: string;
  rows: ManagerRow[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Failed to create");
      } else {
        setName("");
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`${apiPath}?id=${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="New name..." className="max-w-xs" />
        <Button type="submit" disabled={saving}>
          {saving ? "Adding..." : "Add"}
        </Button>
      </form>

      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-foreground-subtle">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/60 hover:bg-surface/40">
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3 text-foreground-muted">{r.slug}</td>
                <td className="px-4 py-3 text-foreground-muted">{r.count ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => del(r.id)} aria-label="Delete" className="text-foreground-subtle hover:text-error">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
