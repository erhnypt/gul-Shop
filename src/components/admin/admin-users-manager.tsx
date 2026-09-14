"use client";

import { Button } from "@/components/ui/button";
import { FormField, Input, Select } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

const roles = ["ADMIN", "SUPER_ADMIN", "SALES", "VIEWER"];

export interface AdminUserRow {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
}

export function AdminUsersManager({
  currentUserId,
  currentRole,
  users,
}: {
  currentUserId: string;
  currentRole: string;
  users: AdminUserRow[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", name: "", password: "", role: "ADMIN" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetting, setResetting] = useState<string | null>(null);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to create");
      setForm({ email: "", name: "", password: "", role: "ADMIN" });
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const toggleRole = async (id: string, role: string) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    });
    router.refresh();
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive }),
    });
    router.refresh();
  };

  const resetPassword = async (id: string, password: string) => {
    const p = prompt("New password (min 6 chars):");
    if (!p || p.length < 6) return;
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password: p }),
    });
    router.refresh();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) alert(data.error ?? "Failed to delete");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="grid gap-3 rounded-lg border border-border bg-background p-4 sm:grid-cols-2 lg:grid-cols-5">
        <FormField label="Email" required>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </FormField>
        <FormField label="Name">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </FormField>
        <FormField label="Password" required>
          <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </FormField>
        <FormField label="Role">
          <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
        </FormField>
        <div className="flex items-end">
          <Button type="submit" disabled={creating} className="w-full">
            {creating ? "Adding..." : "Add User"}
          </Button>
        </div>
      </form>
      {error && <p className="text-sm text-error">{error}</p>}

      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-foreground-subtle">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/60 hover:bg-surface/40">
                <td className="px-4 py-3">
                  <div className="font-medium">{u.name || u.email}</div>
                  <div className="text-xs text-foreground-muted">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <Select
                    value={u.role}
                    onChange={(e) => toggleRole(u.id, e.target.value)}
                    className="w-40"
                    disabled={currentRole !== "SUPER_ADMIN"}
                  >
                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(u.id, !u.isActive)}
                    disabled={u.id === currentUserId}
                    className={
                      u.isActive
                        ? "rounded-full bg-success/10 px-2 py-0.5 text-xs text-success hover:bg-success/20"
                        : "rounded-full bg-error/10 px-2 py-0.5 text-xs text-error hover:bg-error/20"
                    }
                  >
                    {u.isActive ? "Active" : "Disabled"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => resetPassword(u.id, "")} className="text-xs text-foreground-muted hover:text-accent">
                      Reset PW
                    </button>
                    {u.id !== currentUserId && (
                      <button onClick={() => del(u.id)} className="text-xs text-error hover:underline">
                        Delete
                      </button>
                    )}
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
