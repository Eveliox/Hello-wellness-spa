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

const BOOKING_URL = `${site.bookingUrl}?service=trt`;

export const metadata: Metadata = createMetadata({
  title: "TRT (Testosterone Replacement) in SW Miami",
  description:
    "Physician-supervised testosterone replacement therapy in SW Miami. Lab-based diagnosis, personalized dosing, and monthly follow-ups. Free consultation.",
  path: "/services/trt-miami",
  image: "/hormone.jpg",
});

const faqs: FaqItem[] = [
  {
    id: "trt-what",
    question: "What is TRT and how do I know if I need it?",
    answer:
      "Testosterone Replacement Therapy is a medically supervised program that restores testosterone to healthy ranges when labs confirm a clinical deficiency. Symptoms like persistent fatigue, low libido, difficulty building muscle, brain fog, or mood changes are common reasons men get labs drawn, but the diagnosis is based on your bloodwork, not just symptoms.",
    category: "Treatments",
  },
  {
    id: "trt-labs",
    question: "What labs do you run?",
    answer:
      "At minimum: total testosterone, free testosterone, estradiol, SHBG, PSA, and a complete metabolic panel. We may add thyroid, cortisol, or other markers depending on your history. Labs are drawn through LabCorp or Quest, often at the clinic, or at a location convenient to you.",
    category: "Treatments",
  },
  {
    id: "trt-forms",
    question: "What forms of testosterone do you use?",
    answer:
      "We prescribe based on your labs, goals, and preferences. Injections (typically weekly or twice-weekly) are the most common. Some men prefer topical creams. Your provider walks you through the tradeoffs before you commit.",
    category: "Treatments",
  },
  {
    id: "trt-monitor",
    question: "How often will I be monitored?",
    answer:
      "Labs at baseline, at 6–8 weeks after starting, then every 3–6 months once you’re stable. Provider check-ins are monthly during titration and quarterly afterward. This is a program, not a prescription pad.",
    category: "Treatments",
  },
  {
    id: "trt-price",
    question: "How much does TRT cost?",
    answer:
      "The program is cash-pay: it includes labs, provider visits, medication, and monitoring. Your consultation is complimentary, and we quote you the full monthly price before you commit. Members get exclusive pricing (Revive tier).",
    category: "Billing",
  },
  {
    id: "trt-fertility",
    question: "Will TRT affect fertility?",
    answer:
      "Yes, testosterone therapy can suppress sperm production. If you may want children in the future, tell us at the consult. There are protocols that preserve fertility, and we discuss those options honestly before starting.",
    category: "Treatments",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalTherapy",
  name: "Testosterone Replacement Therapy",
  alternateName: ["TRT", "Testosterone therapy", "Hormone replacement therapy for men"],
  drug: { "@type": "Drug", name: "Testosterone" },
  indication: {
    "@type": "MedicalIndication",
    name: "Clinically diagnosed testosterone deficiency (hypogonadism)",
  },
  medicineSystem: "https://schema.org/WesternConventional",
  provider: {
    "@type": "MedicalClinic",
    "@id": `${site.url}/#localbusiness`,
    name: site.name,
    url: site.url,
    telephone: site.phoneDisplay,
  },
  areaServed: { "@type": "City", name: "Miami" },
  url: `${site.url}/services/trt-miami`,
};

export default function TRTMiamiPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={faqPageJsonLd(faqs)} />

      <ServiceHero
        eyebrow="Hormone Therapy · SW Miami"
        title="TRT in SW Miami. Labs first, {italic:prescriptions second}."
        summary="Physician-supervised testosterone replacement therapy for men whose bloodwork confirms a clinical deficiency. Real labs. Real monitoring. No 90-second telehealth questionnaires."
        heroImage="/hormone.jpg"
        heroImageAlt="Testosterone replacement therapy in SW Miami"
        trustChips={["Licensed medical provider", "SW Miami", "Free consultation"]}
        primaryCta={{ label: "Book a Free Consultation", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
        ctaNote="Labs first. You’ll never be prescribed testosterone without confirmed bloodwork."
      />

      <ServiceExpectationBlock
        heading="How the program works"
        sessionNote="Four phases. Every one has a licensed provider on the other side of it."
        steps={[
          {
            title: "Consultation",
            body: "Symptom review, medical history, and goals. Your provider explains what TRT can and can’t do, and what a candidate typically looks like.",
          },
          {
            title: "Labs",
            body: "Total and free testosterone, estradiol, SHBG, PSA, and a metabolic panel. Drawn through LabCorp or Quest. Results reviewed with you in person or on video.",
          },
          {
            title: "Personalized protocol",
            body: "If your labs support a clinical diagnosis, your provider builds a protocol tailored to your baseline, goals, and fertility considerations. You choose injection vs. topical after understanding the tradeoffs.",
          },
          {
            title: "Monitoring",
            body: "Follow-up labs at 6–8 weeks, then every 3–6 months. Monthly provider check-ins during titration, quarterly once you’re stable. This is what makes TRT a program, not a prescription.",
          },
        ]}
        idealForHeading="Ideal for men who want…"
        idealFor={[
          "A real medical program, not a mail-order prescription",
          "In-person labs and provider visits, no 90-second telehealth intake",
          "Honest assessment of whether TRT is actually right for you",
          "Fertility-conscious protocols if you may want children later",
          "Ongoing monitoring so dosing stays in the right range",
        ]}
        helpText={{
          title: "Not sure if you’re a candidate?",
          body: "Your consult is free. If your labs don’t support a clinical need, we’ll tell you, and point you at what actually might help.",
        }}
      />

      <section className="border-y border-line/80 bg-surface py-16">
        <Container className="max-w-3xl">
          <blockquote>
            <p className="font-display text-2xl leading-relaxed text-ink sm:text-3xl">
              &ldquo;The team made me feel comfortable from day one. The program is straightforward
              and the results speak for themselves.&rdquo;
            </p>
            <footer className="mt-6 text-sm font-medium text-muted">
              Maria L. · Kendall · Wellness program guest
            </footer>
          </blockquote>
        </Container>
      </section>

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

      <section className="pb-10">
        <Container className="max-w-3xl">
          <p className="text-xs leading-relaxed text-faint">
            Testosterone is a Schedule III controlled substance and is prescribed only after a
            clinically diagnosed deficiency confirmed by bloodwork. Individual results vary. Not
            appropriate for all patients. A licensed medical provider will assess candidacy at your
            consultation.
          </p>
        </Container>
      </section>
    </>
  );
}
