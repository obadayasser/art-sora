import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Cairo, Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { CartProvider } from "@/contexts/CartContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { CartSidebar } from "@/components/ui/CartSidebar";
import { Navbar } from "@/components/home/Navbar";

import "./globals.css";
import "./custom-scrollbar.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ar",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-en",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ArtSora — Premium Art Frames",
    template: "%s | ArtSora",
  },
  description:
    "Premium framed prints of football legends, music icons, and TV series moments. Bilingual (EN/AR) storefront with secure checkout and nationwide delivery.",
  openGraph: {
    title: "ArtSora — Premium Art Frames",
    description:
      "Own a piece of history in a stunning golden frame — football legends, music icons, and more.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cairo.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ErrorBoundary>
          <ThemeProvider>
            <NextIntlClientProvider messages={messages}>
              <LanguageProvider>
                <AdminAuthProvider>
                  <CartProvider>
                    <Toaster
                      position="top-center"
                      reverseOrder={false}
                      gutter={8}
                      toastOptions={{
                        duration: 3000,
                        style: {
                          background: "var(--toast-bg)",
                          color: "var(--toast-color)",
                          border: "1px solid var(--toast-border)",
                          padding: "16px",
                          borderRadius: "12px",
                          fontSize: "14px",
                          fontWeight: "500",
                        },
                        success: {
                          iconTheme: {
                            primary: "var(--success)",
                            secondary: "#ffffff",
                          },
                        },
                        error: {
                          duration: 4000,
                          iconTheme: {
                            primary: "var(--danger)",
                            secondary: "#ffffff",
                          },
                        },
                      }}
                    />
                    <Navbar />
                    <CartSidebar />
                    <main>{children}</main>
                  </CartProvider>
                </AdminAuthProvider>
              </LanguageProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
