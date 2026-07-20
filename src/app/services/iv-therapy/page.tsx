import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { getService } from "@/content/services";
import { faqsByIds } from "@/content/faqs";
import { testimonials, type Testimonial } from "@/content/testimonials";
import { bookingUrlForServiceSlug } from "@/lib/booking";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { JsonLd } from "@/components/json-ld";
import { faqPageJsonLd } from "@/lib/faq-schema";
import { MembershipUpsell } from "@/components/memberships/membership-upsell";
import { ServiceHero } from "@/components/services/service-hero";
import { ServiceExpectationBlock } from "@/components/services/service-expectation-block";
import { ServiceCTABanner } from "@/components/services/service-cta-banner";
import { IvTherapyContent } from "@/components/services/iv-therapy-content";
import { IvAddOnsSection } from "@/components/services/iv-addons-section";
import { GettingStartedSection } from "@/components/services/getting-started-section";

const service = getService("iv-therapy")!;
const BOOKING_URL = bookingUrlForServiceSlug(service.slug);

export const metadata: Metadata = createMetadata({
  title: `${service.title} in SW Miami`,
  description: service.summary,
  path: `/services/${service.slug}`,
  image: service.heroImage,
});

const ivSteps = service.benefits.map((b) => ({ title: b, body: "" })).filter(() => false); // placeholder — see below

const ivTherapyTestimonials: Testimonial[] = [
  testimonials.find((t) => t.name === "Elena S.") ?? {
    id: "iv-1",
    quote:
      "IVs after long flights used to take me days to recover from. Now I book the hydration blend, work quietly for an hour, and I’m back to baseline.",
    name: "Elena S.",
    detail: "Miami Beach · IV therapy",
    service: "IV therapy",
  },
  {
    id: "iv-2",
    quote:
      "I started with a Myers’ Cocktail before a work trip and felt noticeably sharper. Now it’s part of my monthly routine. The team remembers my blend.",
    name: "Marcus D.",
    detail: "Kendall · IV therapy guest",
    service: "IV therapy",
  },
  {
    id: "iv-3",
    quote:
      "The NAD+ drip was a game-changer for my energy levels. The lounge is comfortable, the nurse checked on me regularly, and I left feeling recharged.",
    name: "Adriana P.",
    detail: "Coral Gables · NAD+ guest",
    service: "NAD+ infusion",
  },
];

export default function IvTherapyPage() {
  const faqs = faqsByIds(service.faqIds);

  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />

      <ServiceHero
        eyebrow={service.eyebrow}
        title="IV therapy in SW Miami. Physician-curated, {italic:never guesswork}."
        summary={service.summary}
        heroImage={service.heroImage}
        heroImageAlt="IV therapy lounge at Hello You Wellness Center"
        trustChips={["Nurse-administered", "SW Miami", "Same-week appointments"]}
        primaryCta={{ label: "Book Your IV Session", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
        ctaNote={service.ctaNote}
      />

      <ServiceExpectationBlock
        sessionNote={service.sessionNote}
        steps={service.benefits.map((b) => ({ title: b, body: "" }))}
        idealFor={service.idealFor}
      />

      <IvTherapyContent bookingUrl={BOOKING_URL} testimonialItems={ivTherapyTestimonials} />
      <IvAddOnsSection isByoIvPage={false} serviceSlug={service.slug} />

      <GettingStartedSection
        steps={service.gettingStartedSteps}
        cta={service.gettingStartedCta}
        serviceSlug={service.slug}
      />

      <MembershipUpsell service="iv" />

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
        variant="dark"
        heading="Ready for your IV therapy visit?"
        body="Walk-ins welcome when availability allows. Same-week appointments are common."
        primaryCta={{ label: "Book Your IV Session", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
      />
    </>
  );
}
