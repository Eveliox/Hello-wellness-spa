import { Suspense } from "react";
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
import { IVBuilder } from "@/components/services/iv-builder";
import { ByoIvContent } from "@/components/services/byo-iv-content";
import { IvAddOnsSection } from "@/components/services/iv-addons-section";
import { GettingStartedSection } from "@/components/services/getting-started-section";

const service = getService("build-your-own-iv")!;
const BOOKING_URL = bookingUrlForServiceSlug(service.slug);

export const metadata: Metadata = createMetadata({
  title: `${service.title} in SW Miami`,
  description: service.summary,
  path: `/services/${service.slug}`,
  image: service.heroImage,
});

const byoIvTestimonials: Testimonial[] = [
  testimonials.find((t) => t.name === "Elena S.") ?? {
    id: "byo-1",
    quote:
      "IVs after long flights used to take me days to recover from. Now I book the hydration blend, work quietly for an hour, and I’m back to baseline.",
    name: "Elena S.",
    detail: "Miami Beach · IV therapy",
    service: "IV therapy",
  },
  {
    id: "byo-2",
    quote:
      "I love that I can tweak my blend each time. Last month was all about immunity before a trip. This month it’s recovery after a marathon. Same clinic, different formula.",
    name: "Ryan K.",
    detail: "Kendall · Build Your Own IV guest",
    service: "Custom IV",
  },
  {
    id: "byo-3",
    quote:
      "My wife and I book adjacent chairs and build our own blends. She goes heavy on the beauty add-ons, I load up on NAD+ and B-complex. It’s become our monthly reset.",
    name: "Andre & Lisa M.",
    detail: "Coral Gables · Couples IV",
    service: "Couples IV",
  },
];

export default function BuildYourOwnIvPage() {
  const faqs = faqsByIds(service.faqIds);

  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />

      <ServiceHero
        eyebrow={service.eyebrow}
        title="Build your own IV. {italic:Your blend}, our science."
        summary={service.summary}
        heroImage={service.heroImage}
        heroImageAlt="Custom IV blend at Hello You Wellness Center"
        trustChips={["Physician-reviewed", "Nurse-administered", "SW Miami"]}
        primaryCta={{ label: "Start Building Your IV", href: "#iv-builder" }}
        secondaryCta={{ label: "Book a Consultation", href: BOOKING_URL }}
        ctaNote={service.ctaNote}
      />

      <section id="iv-builder">
        <Suspense fallback={null}>
          <IVBuilder />
        </Suspense>
      </section>

      <ServiceExpectationBlock
        sessionNote="Allow an extra 10 minutes on your first custom build."
        steps={service.benefits.map((b) => ({ title: b, body: "" }))}
        idealFor={service.idealFor}
      />

      <IvAddOnsSection isByoIvPage={true} serviceSlug={service.slug} />

      <ByoIvContent testimonialItems={byoIvTestimonials} />

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
        heading="Ready to build your blend?"
        body="First-time builders get a complimentary nutrient consultation."
        primaryCta={{ label: "Book Your Custom IV", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
      />
    </>
  );
}
