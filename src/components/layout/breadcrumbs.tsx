import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export async function Breadcrumbs({
  locale,
  items,
}: {
  locale: string;
  items: BreadcrumbItem[];
}) {
  const t = await getDictionary(locale);
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-sm text-foreground-muted"
    >
      <Link
        href={`/${locale}`}
        className="flex items-center gap-1 hover:text-foreground"
      >
        <Home className="h-3.5 w-3.5" />
        {t["nav.home"]}
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-foreground-subtle" />
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
