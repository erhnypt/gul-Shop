import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default async function AdminLoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-foreground px-4">
      <div className="w-full max-w-sm rounded-lg bg-background p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-lg text-white">
            G
          </span>
          <span className="font-serif text-2xl font-semibold text-foreground">
            GulShop Admin
          </span>
        </div>
        <p className="mb-6 text-center text-sm text-foreground-muted">
          Sign in to manage your wholesale showroom
        </p>
        <AdminLoginForm />
        <p className="mt-6 text-center text-xs text-foreground-subtle">
          Development credentials: admin@gulshop.com / admin123
        </p>
      </div>
    </div>
  );
}
