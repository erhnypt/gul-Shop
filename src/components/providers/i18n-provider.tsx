"use client";

import { defaultLocale } from "@/config/i18n";
import { createContext, useContext } from "react";

type Dictionary = Record<string, string>;

const I18nContext = createContext<{
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: string;
}>({
  t: (key) => key,
  locale: defaultLocale,
});

export function useI18n() {
  return useContext(I18nContext);
}

export function I18nProvider({
  dictionary,
  locale,
  children,
}: {
  dictionary: Dictionary;
  locale: string;
  children: React.ReactNode;
}) {
  const t = (key: string, params?: Record<string, string | number>) => {
    let str = dictionary[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(`{${k}}`, String(v));
      }
    }
    return str;
  };

  return (
    <I18nContext.Provider value={{ t, locale }}>
      {children}
    </I18nContext.Provider>
  );
}
