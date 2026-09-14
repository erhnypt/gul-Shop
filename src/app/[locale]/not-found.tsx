import { getDictionary } from "@/lib/i18n";
import Link from "next/link";

export default async function NotFound({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}) {
  const { locale = "en" } = (await params) ?? {};
  const t = await getDictionary(locale);
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-serif text-7xl font-light text-accent">404</p>
      <h1 className="mt-4 font-serif text-2xl text-foreground">
        {t["error.notFound"]}
      </h1>
      <p className="mt-2 max-w-sm text-foreground-muted">
        {t["error.notFoundDesc"]}
      </p>
      <Link
        href={`/${locale}`}
        className="mt-8 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-foreground/90"
      >
        {t["error.goHome"]}
      </Link>
    </div>
  );
}
