import "server-only";
import { defaultLocale, type Locale } from "@/config/i18n";

export async function getDictionary(locale: string) {
  const resolved = (locale as Locale) || defaultLocale;
  if (resolved === "th") {
    const { th } = await import("@/translations/th");
    return th;
  }
  const { en } = await import("@/translations/en");
  return en;
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
