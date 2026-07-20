import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { getService } from "@/content/services";
import { faqsByIds } from "@/content/faqs";
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
import { HormoneTherapyContent } from "@/components/services/hormone-therapy-content";
import { GettingStartedSection } from "@/components/services/getting-started-section";

const service = getService("hormone-therapy")!;
const BOOKING_URL = bookingUrlForServiceSlug(service.slug);

export const metadata: Metadata = createMetadata({
  title: `${service.title} in SW Miami`,
  description: service.summary,
  path: `/services/${service.slug}`,
  image: service.heroImage,
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Hormone therapy",
  provider: {
    "@type": "MedicalClinic",
    name: site.name,
    url: site.url,
    telephone: site.phoneDisplay,
  },
  areaServed: { "@type": "City", name: "Miami" },
  serviceType: "Hormone replacement therapy",
  url: `${site.url}/services/${service.slug}`,
};

export default function HormoneTherapyPage() {
  const faqs = faqsByIds(service.faqIds);

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={faqPageJsonLd(faqs)} />

      <ServiceHero
        eyebrow={service.eyebrow}
        title="Hormone therapy in SW Miami. Labs first, {italic:then a plan}."
        summary={service.summary}
        heroImage={service.heroImage}
        heroImageAlt="Hormone therapy at Hello You Wellness Center"
        trustChips={["Physician-supervised", "Lab-based diagnosis", "SW Miami"]}
        primaryCta={{ label: "Book a Free Consultation", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
        ctaNote={service.ctaNote}
      />

      <ServiceExpectationBlock
        sessionNote={service.sessionNote}
        steps={service.benefits.map((b) => ({ title: b, body: "" }))}
        idealFor={service.idealFor}
      />

      <HormoneTherapyContent bookingUrl={BOOKING_URL} />

      <GettingStartedSection
        steps={service.gettingStartedSteps}
        cta={service.gettingStartedCta}
        serviceSlug={service.slug}
      />

      <MembershipUpsell service="hormone" />

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
        heading="Ready to run labs?"
        body="Consultations are complimentary. Our team confirms within one business day."
        primaryCta={{ label: "Book a Free Consultation", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
      />
    </>
  );
}
