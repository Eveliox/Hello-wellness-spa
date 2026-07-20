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

const BOOKING_URL = `${site.bookingUrl}?service=endolift`;

export const metadata: Metadata = createMetadata({
  title: "Endolift® in SW Miami",
  description:
    "Endolift® — a minimally invasive laser skin-tightening treatment. Performed by our licensed medical team in SW Miami. Free consultation.",
  path: "/services/endolift-miami",
  image: "/skin.jpg",
});

const faqs: FaqItem[] = [
  {
    id: "endolift-what",
    question: "What is Endolift®?",
    answer:
      "Endolift® is a minimally invasive procedure that uses a fine laser fiber placed just under the skin to stimulate collagen and tighten tissue. There are no external incisions, no sutures, and most people return to normal activity within 24–48 hours.",
    category: "Treatments",
  },
  {
    id: "endolift-areas",
    question: "What areas does Endolift® treat?",
    answer:
      "The most common areas are the lower face, jawline, submentum (under the chin), and neck. It’s often chosen by people who want tightening without the downtime of a surgical facelift, or as a maintenance step before considering surgery.",
    category: "Treatments",
  },
  {
    id: "endolift-results",
    question: "When will I see results?",
    answer:
      "Some tightening is visible in the first few weeks. Collagen remodeling continues for 3–6 months, and results typically peak around month 4. Individual results vary, and your provider will review realistic expectations at your consult.",
    category: "Treatments",
  },
  {
    id: "endolift-downtime",
    question: "How much downtime is there?",
    answer:
      "Most patients have mild swelling or bruising for 24–72 hours. You can return to work the next day. Strenuous exercise, saunas, and direct sun should be avoided for 7–10 days.",
    category: "Treatments",
  },
  {
    id: "endolift-price",
    question: "How much does Endolift® cost?",
    answer:
      "Pricing depends on the treatment area and how many zones are addressed in one session. Your consultation is complimentary, and we quote you before you commit to anything. Members save 25% (Revive).",
    category: "Billing",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  name: "Endolift® skin tightening",
  procedureType: "https://schema.org/PercutaneousProcedure",
  bodyLocation: "Face, neck, jawline, submentum",
  preparation:
    "Consultation with a licensed provider; medical history review; avoid blood-thinning medications 5 days prior when possible.",
  followup: "Post-treatment check within 2 weeks; collagen remodeling continues 3–6 months.",
  provider: {
    "@type": "MedicalClinic",
    "@id": `${site.url}/#localbusiness`,
    name: site.name,
    url: site.url,
    telephone: site.phoneDisplay,
  },
  areaServed: { "@type": "City", name: "Miami" },
  url: `${site.url}/services/endolift-miami`,
};

export default function EndoliftMiamiPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={faqPageJsonLd(faqs)} />

      <ServiceHero
        eyebrow="Aesthetics · SW Miami"
        title="Endolift® in SW Miami. Tightening {italic:without the scalpel}."
        summary="A minimally invasive laser treatment that stimulates collagen and tightens skin from underneath. No incisions, no sutures, and most people return to normal activity within a day."
        heroImage="/skin.jpg"
        heroImageAlt="Endolift® skin tightening treatment in SW Miami"
        trustChips={["Licensed APRN", "SW Miami", "Free consultation"]}
        primaryCta={{ label: "Book a Free Consultation", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
        ctaNote="No pressure. Consultations are complimentary and we’ll never recommend more than you need."
      />

      <ServiceExpectationBlock
        heading="What to expect"
        sessionNote="A single session typically runs 45–60 minutes including numbing time."
        steps={[
          {
            title: "Consultation",
            body: "Your provider reviews your goals, skin type, and medical history. We map the treatment zones and answer every question before you commit.",
          },
          {
            title: "Treatment",
            body: "The area is numbed. A fine laser fiber is placed just under the skin through a small entry point. Most guests describe the sensation as warmth, not pain.",
          },
          {
            title: "Recovery",
            body: "Mild swelling for 24–72 hours. You can drive yourself home and return to work the next day. Full aftercare instructions provided.",
          },
          {
            title: "Results over time",
            body: "Early tightening in the first weeks. Collagen remodeling continues 3–6 months with results typically peaking around month four.",
          },
        ]}
        idealFor={[
          "Visible tightening in the lower face, jawline, or under the chin",
          "A minimally invasive alternative to a surgical facelift",
          "Little to no downtime, back to work the next day",
          "Long-lasting collagen improvement, not just a temporary lift",
          "An honest consult that quotes a real price before you commit",
        ]}
        helpText={{
          title: "Not sure if it’s right for you?",
          body: "Your consult is free. We’ll assess candidacy honestly. If a different treatment fits your goals better, we’ll tell you.",
        }}
      />

      <section className="border-y border-line/80 bg-surface py-16">
        <Container className="max-w-3xl">
          <blockquote>
            <p className="font-display text-2xl leading-relaxed text-ink sm:text-3xl">
              &ldquo;Three months later, people just say I look rested. Nobody can tell what I did,
              which is exactly what I asked for.&rdquo;
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
        heading="Ready to see if Endolift® is right for you?"
        body="Consultations are complimentary. Our team confirms within one business day."
        primaryCta={{ label: "Book a Free Consultation", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
      />

      <section className="pb-10">
        <Container className="max-w-3xl">
          <p className="text-xs leading-relaxed text-faint">
            Endolift® is a registered trademark of Eufoton. Individual results vary. This procedure
            is not a substitute for a surgical facelift when significant tissue laxity is present. A
            licensed provider will assess candidacy at your consultation.
          </p>
        </Container>
      </section>
    </>
  );
}
