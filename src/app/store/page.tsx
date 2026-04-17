import type { Metadata } from "next";
import { Suspense } from "react";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { TrustChip } from "@/components/ui/trust-chip";
import { StoreCatalog } from "@/components/store/store-catalog";

export const metadata: Metadata = createMetadata({
  title: "Store",
  description: `Medical-grade wellness products, weight loss programs, and research peptides from ${site.name}.`,
  path: "/store",
});

export default function StorePage() {
  return (
    <>
      <section className="border-b border-line/80 bg-surface py-14">
        <Container className="max-w-4xl">
          <TrustChip>Retail</TrustChip>
          <h1 className="mt-4 font-display text-4xl text-balance text-ink sm:text-5xl">Hello You Wellness Store</h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Medical-grade wellness products, weight loss programs, and research peptides — shipped directly to you or
            available for pickup at our SW Miami clinic.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href={site.bookingUrl} size="lg" className="bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90">
              Book a Free Consultation
            </Button>
            <a className="text-sm font-medium text-[#333] underline-offset-2 hover:underline" href={`tel:${site.phoneTel}`}>
              Call {site.phoneDisplay}
            </a>
          </div>
        </Container>
      </section>

      <Suspense fallback={null}>
        <StoreCatalog />
      </Suspense>
    </>
  );
}
