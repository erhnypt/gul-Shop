"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Tags,
  Shapes,
  Award,
  ClipboardList,
  Users,
  Settings,
  FileText,
  ScrollText,
  LogOut,
  HelpCircle,
  Images,
  ShieldCheck,
  BarChart3,
  BadgeCheck,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/brands", label: "Brands", icon: Tags },
  { href: "/admin/functions", label: "Functions", icon: Shapes },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/rfqs", label: "RFQs", icon: ClipboardList },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/testimonials", label: "Testimonials", icon: BadgeCheck },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/hero-slides", label: "Hero Slides", icon: Images },
  { href: "/admin/users", label: "Users", icon: ShieldCheck },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface/50 lg:flex">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm text-white">
            G
          </span>
          <span className="font-serif text-lg font-semibold">GulShop Admin</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-foreground text-background"
                    : "text-foreground-muted hover:bg-surface-hover hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <div className="mb-2 px-3 text-sm font-medium text-foreground">{userName}</div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground-muted hover:bg-surface-hover hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="flex items-center justify-between border-b border-border bg-surface/50 px-4 py-3 lg:hidden">
        <span className="font-serif text-lg font-semibold">GulShop Admin</span>
        <div className="flex items-center gap-2">
          <button onClick={logout} className="text-sm text-foreground-muted">Sign Out</button>
          <button
            onClick={() => setOpen(!open)}
            className="rounded-md border border-border px-3 py-1.5 text-sm"
          >
            Menu
          </button>
        </div>
      </div>
      {open && (
        <div className="border-b border-border bg-background lg:hidden">
          <nav className="space-y-1 p-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground-muted hover:bg-surface-hover"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
