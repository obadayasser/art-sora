import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export const rtlLocales: Locale[] = ["ar"];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const requestedLocale = cookieStore.get("locale")?.value;
  const locale = locales.includes(requestedLocale as Locale)
    ? (requestedLocale as Locale)
    : "en";

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
