import { getDictionary } from "@/lib/i18n";

export async function AnnouncementBar({ locale }: { locale: string }) {
  const t = await getDictionary(locale);
  return (
    <div className="bg-foreground px-4 py-2 text-center text-xs font-medium tracking-wide text-background">
      {t["footer.tagline"]} — {t["common.requestWholesaleQuote"].toUpperCase()}
    </div>
  );
}
