import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { JsonLd } from "@/components/json-ld";
import { faqPageJsonLd } from "@/lib/faq-schema";
import { MembershipUpsell } from "@/components/memberships/membership-upsell";
import { ServiceHero } from "@/components/services/service-hero";
import { ServiceExpectationBlock } from "@/components/services/service-expectation-block";
import { ServiceCTABanner } from "@/components/services/service-cta-banner";
import type { FaqItem } from "@/content/faqs";

const BOOKING_URL = `${site.bookingUrl}?service=non-surgical-bbl`;

export const metadata: Metadata = createMetadata({
  title: "Non-Surgical BBL in SW Miami",
  description:
    "Non-surgical BBL alternatives in SW Miami — biostimulator-based contouring and shape refinement with no anesthesia and no downtime. Free consultation with a licensed provider.",
  path: "/services/non-surgical-bbl-miami",
  image: "/wellness.jpg",
});

const faqs: FaqItem[] = [
  {
    id: "bbl-what",
    question: "What is a non-surgical BBL?",
    answer:
      "It’s an umbrella term for injectable and energy-based treatments that improve shape, projection, and skin quality of the buttocks without surgery. Most commonly it uses biostimulators like Sculptra® to trigger the body to build its own collagen over time.",
    category: "Treatments",
  },
  {
    id: "bbl-vs-surgical",
    question: "Is this the same as a Brazilian Butt Lift?",
    answer:
      "No. A surgical BBL is a fat-transfer procedure done under anesthesia. This is a non-surgical alternative: subtler, incremental, and much lower risk. If your goal is a large volume change, surgery is the honest answer and we’ll tell you that at the consult.",
    category: "Treatments",
  },
  {
    id: "bbl-how-many",
    question: "How many sessions will I need?",
    answer:
      "Most patients need 2–4 sessions spaced 4–6 weeks apart, depending on baseline anatomy and goals. Biostimulators work over months, so you build up gradually rather than seeing everything at once.",
    category: "Treatments",
  },
  {
    id: "bbl-downtime",
    question: "How much downtime is there?",
    answer:
      "Little to none. Some tenderness or mild swelling for 1–3 days. Most patients return to normal activity immediately and workouts the next day.",
    category: "Treatments",
  },
  {
    id: "bbl-results",
    question: "When will I see results?",
    answer:
      "Some improvement in the first few weeks. Peak results typically show around month 4–6 as new collagen matures. Effects often last 1–2 years, with maintenance sessions extending that.",
    category: "Treatments",
  },
  {
    id: "bbl-candidate",
    question: "Am I a candidate?",
    answer:
      "Best candidates want subtle-to-moderate improvement, are within a stable weight range, and don’t want the recovery of surgery. Your provider assesses skin quality, existing shape, and goals honestly before recommending anything.",
    category: "Treatments",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  name: "Non-surgical BBL (biostimulator contouring)",
  procedureType: "https://schema.org/NoninvasiveProcedure",
  bodyLocation: "Gluteal region",
  provider: {
    "@type": "MedicalClinic",
    "@id": `${site.url}/#localbusiness`,
    name: site.name,
    url: site.url,
    telephone: site.phoneDisplay,
  },
  areaServed: { "@type": "City", name: "Miami" },
  url: `${site.url}/services/non-surgical-bbl-miami`,
};

export default function NonSurgicalBblMiamiPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={faqPageJsonLd(faqs)} />

      <ServiceHero
        eyebrow="Aesthetics · SW Miami"
        title="Non-Surgical BBL in SW Miami. Shape {italic:without the OR}."
        summary="Biostimulator-based contouring for subtle-to-moderate improvement in shape, projection, and skin quality. No anesthesia, no surgical recovery, no dramatic weekend transformations. Real, gradual collagen you build yourself."
        heroImage="/wellness.jpg"
        heroImageAlt="Non-surgical BBL alternative in SW Miami"
        trustChips={["Licensed medical provider", "SW Miami", "Free consultation"]}
        primaryCta={{ label: "Book a Free Consultation", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
        ctaNote="We’ll tell you honestly if surgery is a better fit for your goals. This is not for everyone."
      />

      <ServiceExpectationBlock
        heading="What to expect"
        sessionNote="Each session runs 45–60 minutes. Series of 2–4 spaced 4–6 weeks apart."
        steps={[
          {
            title: "Consultation",
            body: "Your provider assesses shape, skin, and goals, and tells you honestly whether non-surgical is the right tool or whether you should see a plastic surgeon.",
          },
          {
            title: "Treatment sessions",
            body: "Biostimulator is placed through fine injections. Topical numbing is applied. Sessions are 45–60 minutes.",
          },
          {
            title: "Recovery",
            body: "Mild tenderness or swelling for 1–3 days. Return to normal activity immediately; workouts the next day.",
          },
          {
            title: "Results over months",
            body: "You build collagen gradually. Peak results around month 4–6. Maintenance sessions extend effects for 1–2+ years.",
          },
        ]}
        idealFor={[
          "Subtle-to-moderate improvement in shape and projection",
          "A non-surgical option with no anesthesia or downtime",
          "Skin quality improvement, not just contour",
          "Gradual, natural collagen. Not a dramatic overnight change",
          "An honest assessment, including whether surgery would serve you better",
        ]}
        helpText={{
          title: "Not the same as surgery.",
          body: "If your goal is dramatic volume change, a surgical BBL is more effective. We’ll refer you to a board-certified plastic surgeon if that’s honestly the right path.",
        }}
      />

      <section className="border-y border-line/80 bg-surface py-16">
        <Container className="max-w-3xl">
          <blockquote>
            <p className="font-display text-2xl leading-relaxed text-ink sm:text-3xl">
              &ldquo;The team made me feel comfortable from day one. Straightforward, honest, and no
              upsell.&rdquo;
            </p>
            <footer className="mt-6 text-sm font-medium text-muted">
              Maria L. · Kendall · Wellness guest
            </footer>
          </blockquote>
        </Container>
      </section>

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
        heading="Ready to see if this is right for you?"
        body="Consultations are complimentary. Our team confirms within one business day."
        primaryCta={{ label: "Book a Free Consultation", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
      />

      <section className="pb-10">
        <Container className="max-w-3xl">
          <p className="text-xs leading-relaxed text-faint">
            Individual results vary. Non-surgical BBL alternatives do not produce the volume change
            of a surgical Brazilian Butt Lift. A licensed medical provider will assess candidacy
            honestly at your consultation.
          </p>
        </Container>
      </section>
    </>
  );
}
