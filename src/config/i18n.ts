export type Locale = "en" | "th";

export const locales: Locale[] = ["en", "th"];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  th: "ไทย",
};
