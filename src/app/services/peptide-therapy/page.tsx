import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { getService } from "@/content/services";
import { faqsByIds } from "@/content/faqs";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { JsonLd } from "@/components/json-ld";
import { faqPageJsonLd } from "@/lib/faq-schema";
import { MembershipUpsell } from "@/components/memberships/membership-upsell";
import { ServiceHero } from "@/components/services/service-hero";
import { ServiceExpectationBlock } from "@/components/services/service-expectation-block";
import { ServiceCTABanner } from "@/components/services/service-cta-banner";
import { GettingStartedSection } from "@/components/services/getting-started-section";

const service = getService("peptide-therapy")!;
const BOOKING_URL = service.gettingStartedCta.href;

export const metadata: Metadata = createMetadata({
  title: `${service.title} in SW Miami`,
  description: service.summary,
  path: `/services/${service.slug}`,
  image: service.heroImage,
});

export default function PeptideTherapyPage() {
  const faqs = faqsByIds(service.faqIds);

  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />

      <ServiceHero
        eyebrow={service.eyebrow}
        title="Peptide therapy in SW Miami. {italic:Under real supervision}."
        summary={service.summary}
        heroImage={service.heroImage}
        heroImageAlt="Peptide therapy at Hello You Wellness Center"
        trustChips={["APRN-supervised", "Lot-traceable", "SW Miami"]}
        primaryCta={{ label: "Book a Consultation", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
        ctaNote={service.ctaNote}
      />

      <ServiceExpectationBlock
        heading="What’s included"
        sessionNote={service.sessionNote}
        steps={service.benefits.map((b) => ({ title: b, body: "" }))}
        idealForHeading="Designed for"
        idealFor={service.idealFor}
      />

      <GettingStartedSection
        steps={service.gettingStartedSteps}
        cta={service.gettingStartedCta}
        serviceSlug={service.slug}
      />

      <MembershipUpsell service="peptide" />

      <section className="py-16">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-3xl text-ink">Common questions</h2>
            <p className="mt-3 text-sm text-muted">
              Still deciding? These answers mirror what we share at the consult.
            </p>
            <Button href="/faq" variant="secondary" className="mt-6" size="md">
              Full FAQ library
            </Button>
          </div>
          <div>
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </section>

      <ServiceCTABanner
        variant="soft"
        heading="Questions about peptides?"
        body="Message us for candidacy questions, protocol details, or documentation."
        primaryCta={{ label: "Book a Consultation", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
      />
    </>
  );
}
