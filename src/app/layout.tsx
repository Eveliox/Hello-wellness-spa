import type { Metadata, Viewport } from "next";
import { Alex_Brush, Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SkipLink } from "@/components/layout/skip-link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StickyBookCta } from "@/components/layout/sticky-book-cta";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { JsonLd } from "@/components/json-ld";
import { ConsentDefault, GtmScript, GtmNoscript } from "@/components/analytics/gtm";
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

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  variable: "--font-alex-brush",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  ...createMetadata({
    title: site.name,
    description: site.tagline,
    path: "/",
  }),
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
      className={`${plusJakarta.variable} ${fraunces.variable} ${alexBrush.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        {/*
          Order matters: ConsentDefault MUST render before GtmScript so that
          the default-denied consent state is applied to the dataLayer before
          any GTM tag evaluates its consent gating. Both no-op when
          NEXT_PUBLIC_GTM_ID is unset (dev/preview safe).
        */}
        <ConsentDefault />
        <GtmScript />
      </head>
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <GtmNoscript />
        <JsonLd data={localBusinessJsonLd()} />
        <SkipLink />
        <Header />
        <main id="main-content" className="flex-1 pb-28 md:pb-0">
          {children}
        </main>
        <Footer />
        <StickyBookCta />
        <WhatsAppFab />
      </body>
    </html>
  );
}
