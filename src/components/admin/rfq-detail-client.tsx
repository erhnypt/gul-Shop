"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = ["NEW", "CONTACTED", "QUOTATION_SENT", "NEGOTIATION", "WON", "LOST", "ARCHIVED"];

export function RfqDetailClient({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const changeStatus = async (s: string) => {
    setStatus(s);
    await fetch(`/api/admin/rfqs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: s }),
    });
    router.refresh();
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setSaving(true);
    await fetch(`/api/admin/rfqs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: note.trim() }),
    });
    setNote("");
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Status</h3>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => changeStatus(s)}
              className={
                status === s
                  ? "rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background"
                  : "rounded-full border border-border px-4 py-2 text-xs text-foreground-muted hover:bg-surface"
              }
            >
              {s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={addNote} className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Add Internal Note (not visible to customer)</h3>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal notes for the sales team..." />
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? "Saving..." : "Add Note"}
        </Button>
      </form>
    </div>
  );
}
