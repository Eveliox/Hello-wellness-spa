import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { faqs } from "@/content/faqs";
import { Container } from "@/components/ui/container";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { faqPageJsonLd } from "@/lib/faq-schema";

export const metadata: Metadata = createMetadata({
  title: "FAQ",
  description: `Frequently asked questions about booking, treatments, and billing at ${site.name} in Miami.`,
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <section className="border-b border-line/80 bg-surface py-14">
        <Container className="max-w-3xl">
          <h1 className="font-display text-4xl text-balance text-ink sm:text-5xl">
            Questions, answered with{" "}
            <span className="font-script text-[1.3em] font-normal italic leading-none text-[#E8B4A3]">
              clarity
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Still unsure? Our concierge team loves detail-oriented emails—no question is too small before your first
            visit.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`tel:${site.phoneTel}`} size="lg">
              Call {site.phoneDisplay}
            </Button>
            <Button href={site.social.instagram} variant="secondary" size="lg">
              Instagram
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Contact us
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-3xl">
          <FaqAccordion items={faqs} />
        </Container>
      </section>
    </>
  );
}
