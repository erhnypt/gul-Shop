import { AdminUsersManager } from "@/components/admin/admin-users-manager";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export default async function AdminUsersPage() {
  const [users, me] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    }),
    getSessionUser(),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-serif text-2xl font-light text-foreground">Admin Users</h1>
      <AdminUsersManager
        currentUserId={me?.id ?? ""}
        currentRole={me?.role ?? "VIEWER"}
        users={users}
      />
    </div>
  );
}