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

const BOOKING_URL = `${site.bookingUrl}?service=pdo-threads`;

export const metadata: Metadata = createMetadata({
  title: "PDO Thread Lift in SW Miami",
  description:
    "PDO thread lift in SW Miami — subtle repositioning of the mid-face, jawline, and neck using absorbable sutures. Performed by licensed medical providers. Free consultation.",
  path: "/services/pdo-threads-miami",
  image: "/skin.jpg",
});

const faqs: FaqItem[] = [
  {
    id: "pdo-what",
    question: "What is a PDO thread lift?",
    answer:
      "A PDO (polydioxanone) thread lift uses absorbable sutures placed under the skin to reposition tissue and stimulate collagen. Threads dissolve over 6–8 months, but the collagen and structural lift they trigger persist longer.",
    category: "Treatments",
  },
  {
    id: "pdo-areas",
    question: "Where is it typically used?",
    answer:
      "Most commonly the mid-face, jawline, jowls, brows, and neck. It’s a middle path between injectables and a surgical facelift, best when you want repositioning, not just volume.",
    category: "Treatments",
  },
  {
    id: "pdo-results",
    question: "How long do results last?",
    answer:
      "Immediate lift is visible the day of. Collagen remodeling continues for months. Most patients see meaningful benefit for 12–18 months, though individual results vary.",
    category: "Treatments",
  },
  {
    id: "pdo-downtime",
    question: "How much downtime is there?",
    answer:
      "Mild swelling and possible bruising for 3–7 days. Most patients return to work the next day. Avoid strenuous activity, saunas, and dental work for 2 weeks.",
    category: "Treatments",
  },
  {
    id: "pdo-vs",
    question: "Is this instead of Botox or filler?",
    answer:
      "It’s often complementary. Botox relaxes muscles; filler adds volume; threads reposition tissue and stimulate collagen. Your provider maps a plan based on what your face actually needs, never a package sold on volume.",
    category: "Treatments",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  name: "PDO thread lift",
  procedureType: "https://schema.org/PercutaneousProcedure",
  bodyLocation: "Mid-face, jawline, jowls, neck, brows",
  provider: {
    "@type": "MedicalClinic",
    "@id": `${site.url}/#localbusiness`,
    name: site.name,
    url: site.url,
    telephone: site.phoneDisplay,
  },
  areaServed: { "@type": "City", name: "Miami" },
  url: `${site.url}/services/pdo-threads-miami`,
};

export default function PdoThreadsMiamiPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={faqPageJsonLd(faqs)} />

      <ServiceHero
        eyebrow="Aesthetics · SW Miami"
        title="PDO Thread Lift in SW Miami. Repositioning, {italic:not just volume}."
        summary="Absorbable sutures placed under the skin to reposition tissue and stimulate collagen. A middle path between injectables and surgery. Subtle, structural, and honest."
        heroImage="/skin.jpg"
        heroImageAlt="PDO thread lift in SW Miami"
        trustChips={["Licensed medical provider", "SW Miami", "Free consultation"]}
        primaryCta={{ label: "Book a Free Consultation", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
        ctaNote="No pressure. Consultations are complimentary and we’ll never recommend more than you need."
      />

      <ServiceExpectationBlock
        heading="What to expect"
        sessionNote="A session typically runs 60–90 minutes including numbing time."
        steps={[
          {
            title: "Consultation",
            body: "Your provider maps facial anatomy, discusses realistic outcomes, and confirms whether threads are actually the right tool for your goals.",
          },
          {
            title: "Treatment",
            body: "Topical numbing is applied. Threads are placed through fine entry points using cannulas. Most guests describe pressure, not sharp pain.",
          },
          {
            title: "Recovery",
            body: "Mild swelling and possible bruising for 3–7 days. Sleep on your back for a week. Avoid facial massage and dental work for 2 weeks.",
          },
          {
            title: "Results",
            body: "Immediate lift the day of. Collagen builds over 3–6 months. Most patients see meaningful benefit for 12–18 months.",
          },
        ]}
        idealFor={[
          "Subtle repositioning of the mid-face, jawline, or jowls",
          "A step beyond injectables but short of surgery",
          "Collagen stimulation on top of the immediate lift",
          "A provider who’ll tell you when threads aren’t the right answer",
          "Natural results. You should look like you, refreshed",
        ]}
        helpText={{
          title: "Not sure it’s the right tool?",
          body: "Threads work for repositioning. If your goal is volume, filler is often better; if it’s deep laxity, surgery may be the honest answer. Your consult is free.",
        }}
      />

      <section className="border-y border-line/80 bg-surface py-16">
        <Container className="max-w-3xl">
          <blockquote>
            <p className="font-display text-2xl leading-relaxed text-ink sm:text-3xl">
              &ldquo;I was nervous about looking overdone. They started conservatively and built up
              gradually, exactly what I asked for.&rdquo;
            </p>
            <footer className="mt-6 text-sm font-medium text-muted">
              Diana L. · Westchester · Aesthetics guest
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
        heading="Ready to see if threads are right for you?"
        body="Consultations are complimentary. Our team confirms within one business day."
        primaryCta={{ label: "Book a Free Consultation", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
      />

      <section className="pb-10">
        <Container className="max-w-3xl">
          <p className="text-xs leading-relaxed text-faint">
            Individual results vary. PDO thread lifts are not a substitute for a surgical facelift
            when significant tissue laxity is present. A licensed medical provider will assess
            candidacy at your consultation.
          </p>
        </Container>
      </section>
    </>
  );
}
