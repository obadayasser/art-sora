import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { CartProvider } from "@/contexts/CartContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { CartSidebar } from "@/components/ui/CartSidebar";
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
        <meta name="disable-local-network" content="true" />
        <meta httpEquiv="Content-Security-Policy" content="connect-src 'self' https: http: ws: wss:;" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;700&family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
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
                  <Navbar />
                  <CartSidebar />
                  <main>{children}</main>
                </CartProvider>
              </AdminAuthProvider>
            </LanguageProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
