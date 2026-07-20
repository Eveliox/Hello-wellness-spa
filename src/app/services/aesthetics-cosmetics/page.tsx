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
import { AestheticsContent } from "@/components/services/aesthetics-content";
import { GettingStartedSection } from "@/components/services/getting-started-section";

const service = getService("aesthetics-cosmetics")!;
const BOOKING_URL = bookingUrlForServiceSlug(service.slug);

export const metadata: Metadata = createMetadata({
  title: "Aesthetics & Cosmetics in SW Miami",
  description:
    "Botox, dermal fillers, and aesthetic treatments in SW Miami. Conservative technique, natural movement, and plans tailored to your anatomy and goals.",
  path: `/services/${service.slug}`,
  image: service.heroImage,
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Aesthetics & cosmetics",
  provider: {
    "@type": "MedicalClinic",
    name: site.name,
    url: site.url,
    telephone: site.phoneDisplay,
  },
  areaServed: { "@type": "City", name: "Miami" },
  serviceType: "Aesthetics services",
  url: `${site.url}/services/${service.slug}`,
};

const aestheticsSteps = [
  {
    title: "Treatment plans tailored to bone structure and skin type",
    body: service.benefits[0] ?? "",
  },
  {
    title: "Conservative technique with meticulous placement",
    body: service.benefits[1] ?? "",
  },
  {
    title: "Photography-friendly lighting for honest before/after review",
    body: service.benefits[2] ?? "",
  },
  {
    title: "Recovery guidance you can follow between visits",
    body: service.benefits[3] ?? "",
  },
].filter((s) => s.body);

const aestheticsTestimonials: Testimonial[] = [
  testimonials.find((t) => t.name === "Camila R.") ?? {
    id: "aes-1",
    quote:
      "The space feels like a private members’ lounge, not a clinic. My injector listened more than she talked, and the results look like me on a very good week.",
    name: "Camila R.",
    detail: "Kendall · Aesthetics guest",
    service: "Aesthetics",
  },
  {
    id: "aes-2",
    quote:
      "I was nervous about looking overdone. They started conservatively and built up gradually, exactly what I asked for. Three months later, people just say I look rested.",
    name: "Diana L.",
    detail: "Westchester · Botox & filler guest",
    service: "Injectables",
  },
  {
    id: "aes-3",
    quote:
      "The signature facial was a calm, thoughtful experience. My skin felt brighter and smoother for weeks. I’m already booked for my next visit.",
    name: "Sophia M.",
    detail: "Coral Gables · Facial guest",
    service: "Skin care",
  },
];

export default function AestheticsCosmeticsPage() {
  const faqs = faqsByIds(service.faqIds);

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={faqPageJsonLd(faqs)} />

      <ServiceHero
        eyebrow={service.eyebrow}
        title="Aesthetics & cosmetics in SW Miami. Refined, {italic:never overdone}."
        summary={service.summary}
        heroImage={service.heroImage}
        heroImageAlt="Aesthetics and cosmetics at Hello You Wellness Center"
        trustChips={["Licensed injector", "SW Miami", "Free consultation"]}
        primaryCta={{ label: "Book a Free Consultation", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
        ctaNote={service.ctaNote}
      />

      <ServiceExpectationBlock
        sessionNote={service.sessionNote}
        steps={aestheticsSteps}
        idealFor={service.idealFor}
      />

      <AestheticsContent service={service} bookingUrl={BOOKING_URL} testimonialItems={aestheticsTestimonials} />

      <GettingStartedSection
        steps={service.gettingStartedSteps}
        cta={service.gettingStartedCta}
        serviceSlug={service.slug}
      />

      <MembershipUpsell service="aesthetics" />

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
        heading="Ready for your aesthetics visit?"
        body="No pressure. Consultations are complimentary and we’ll never recommend more than you need."
        primaryCta={{ label: "Book a Free Consultation", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
      />
    </>
  );
}
