import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SkipLink } from "@/components/layout/skip-link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StickyBookCta } from "@/components/layout/sticky-book-cta";
import { JsonLd } from "@/components/json-ld";
import { createMetadata } from "@/lib/seo";
import { localBusinessJsonLd } from "@/lib/schema";
import { site } from "@/content/site";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  ...createMetadata({
    title: site.name,
    description: site.tagline,
    path: "/",
  }),
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#212020",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${fraunces.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <JsonLd data={localBusinessJsonLd()} />
        <SkipLink />
        <Header />
        <main id="main-content" className="flex-1 pb-28 md:pb-0">
          {children}
        </main>
        <Footer />
        <StickyBookCta />
      </body>
    </html>
  );
}
