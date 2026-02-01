"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export const rtlLocales: Locale[] = ["ar"];

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const savedLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("locale="))
      ?.split("=")[1] as Locale | undefined;

    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale);
      setIsRTL(rtlLocales.includes(savedLocale));
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale, isRTL]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setIsRTL(rtlLocales.includes(newLocale));
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    window.location.reload();
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
