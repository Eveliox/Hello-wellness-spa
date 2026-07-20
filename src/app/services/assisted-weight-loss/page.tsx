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
import { WeightLossContent } from "@/components/services/weight-loss-content";
import { WeightLossPlans } from "@/components/services/weight-loss-plans";
import { GettingStartedSection } from "@/components/services/getting-started-section";

const service = getService("assisted-weight-loss")!;
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
  name: "Assisted weight loss",
  provider: {
    "@type": "MedicalClinic",
    name: site.name,
    url: site.url,
    telephone: site.phoneDisplay,
  },
  areaServed: { "@type": "City", name: "Miami" },
  serviceType: "Medical weight management",
  url: `${site.url}/services/${service.slug}`,
};

const weightLossTestimonials: Testimonial[] = [
  ...testimonials.filter((t) => (t.service ?? "").toLowerCase().includes("weight")).slice(0, 1),
  {
    id: "wl-1",
    quote:
      "The team made me feel comfortable from day one. The program is straightforward and the results speak for themselves.",
    name: "Maria L.",
    detail: "Kendall · Medical weight loss",
    service: "Weight loss",
  },
  {
    id: "wl-2",
    quote:
      "I appreciated the privacy and the medical supervision. This isn’t a fad diet, it’s a real program with real support.",
    name: "Carlos R.",
    detail: "Coral Gables · GLP-1 program",
    service: "Weight loss",
  },
].slice(0, 3);

const weightLossSteps = [
  { title: "Consultation", body: service.benefits[0] ?? "" },
  { title: "Plan + pacing", body: service.benefits[1] ?? "" },
  { title: "Lifestyle support", body: service.benefits[2] ?? "" },
  { title: "Follow-ups", body: service.benefits[3] ?? "" },
].filter((s) => s.body);

export default function AssistedWeightLossPage() {
  const faqs = faqsByIds(service.faqIds);

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={faqPageJsonLd(faqs)} />

      <ServiceHero
        eyebrow={service.eyebrow}
        title="Assisted weight loss in SW Miami. Medical support that {italic:actually shows up}."
        summary={service.summary}
        heroImage={service.heroImage}
        heroImageAlt="Assisted weight loss program at Hello You Wellness Center"
        trustChips={["Physician-led", "SW Miami", "Free consultation"]}
        primaryCta={{ label: "Book a Free Consultation", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
        ctaNote={service.ctaNote}
      />

      <ServiceExpectationBlock
        sessionNote={service.sessionNote}
        steps={weightLossSteps}
        idealFor={service.idealFor}
      />

      <WeightLossPlans />
      <WeightLossContent testimonialItems={weightLossTestimonials} />

      <GettingStartedSection
        steps={service.gettingStartedSteps}
        cta={service.gettingStartedCta}
        serviceSlug={service.slug}
      />

      <MembershipUpsell service="weight-loss" />

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
        heading="Ready for your weight loss visit?"
        body="No commitment required. Our team responds within one business day."
        primaryCta={{ label: "Book a Free Consultation", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
      />

      <section className="pb-10">
        <Container className="max-w-3xl">
          <p className="text-xs leading-relaxed text-faint">
            Individual results may vary. GLP-1 receptor agonist medications are FDA-approved and
            prescribed by licensed medical professionals. This program is not a substitute for a
            healthy diet and regular exercise. Consult with your provider to determine if this
            program is right for you.
          </p>
        </Container>
      </section>
    </>
  );
}
