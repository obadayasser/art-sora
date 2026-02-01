import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
 import { CartProvider } from "@/contexts/CartContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { CartSidebar } from "@/components/ui/CartSidebar";

import { Toaster as HotToaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { CartProvider } from "@/contexts/CartContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { CartSidebar } from "@/components/ui/CartSidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import "./globals.css";
import "./custom-scrollbar.css";
import { Navbar } from "@/components/home/Navbar";
 
export const metadata: Metadata = {
  title: "ArtSora - Your Online Art Store",
  description: "Discover and purchase stunning artworks from emerging and established artists around the world at ArtSora.",
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
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;700&family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">

        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <LanguageProvider>
 

        <ErrorBoundary>
          <ThemeProvider>
            <NextIntlClientProvider messages={messages}>
              <LanguageProvider>

                <AdminAuthProvider>
                  <CartProvider>
                    <Toaster
                      position="top-center"
                      richColors
                      closeButton
                      toastOptions={{
                        duration: 4000,
                        className: "font-medium",
                      }}
                    />


                    <HotToaster
                      position="top-center"
                      reverseOrder={false}
                      gutter={8}
                      toastOptions={{
                        duration: 3000,
                        style: {
                          background: 'var(--toast-bg)',
                          color: 'var(--toast-color)',
                          border: '1px solid var(--toast-border)',
                          padding: '16px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '500',
                        },
                        success: {
                          duration: 3000,
                          iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                          },
                        },
                        error: {
                          duration: 4000,
                          iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
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

              </LanguageProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </ErrorBoundary>

      </body>
    </html>
  );
}
