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

const BOOKING_URL = `${site.bookingUrl}?service=mobile-iv`;

export const metadata: Metadata = createMetadata({
  title: "Mobile IV Therapy in Miami — We Come to You",
  description:
    "Concierge mobile IV therapy across Miami — hotels, homes, offices, and events. Nurse-administered hydration, recovery, and vitality drips. Same-day availability by appointment.",
  path: "/services/mobile-iv-miami",
  image: "/IV infusion.jpg",
});

const faqs: FaqItem[] = [
  {
    id: "mobile-what",
    question: "Where do you come to?",
    answer:
      "Homes, hotels, offices, and event venues across greater Miami. Kendall, Coral Gables, Westchester, Pinecrest, Brickell, Downtown, and Miami Beach. Outside those areas we can often accommodate with a small travel fee.",
    category: "Treatments",
  },
  {
    id: "mobile-who",
    question: "Who administers the IV?",
    answer:
      "A licensed nurse or APRN, every time. Every mobile visit is medically supervised. We screen for contraindications before we come, and the nurse stays with you through the full drip.",
    category: "Treatments",
  },
  {
    id: "mobile-blends",
    question: "What blends can I choose from?",
    answer:
      "Hydration, Myers’ Cocktail, Glutathione push, NAD+, and custom Build-Your-Own blends. Beauty and recovery add-ons available. Your consult covers what fits your goals.",
    category: "Treatments",
  },
  {
    id: "mobile-time",
    question: "How long does it take?",
    answer:
      "Setup and consult: 10 minutes. Drip: 30–60 minutes for most standard blends, longer for NAD+. Total time on-site: typically 45–90 minutes.",
    category: "Treatments",
  },
  {
    id: "mobile-groups",
    question: "Can you do group or event sessions?",
    answer: `Yes. Wedding parties, sports teams, corporate wellness, and hotel packages are our fastest-growing category. Contact us for group pricing, call ${site.phoneDisplay} or use the button below.`,
    category: "Booking",
  },
  {
    id: "mobile-pricing",
    question: "How much extra vs. in-clinic?",
    answer:
      "Concierge pricing runs 1.5–2× in-clinic rates to cover nurse travel time. Members get standard 15–25% off on the base drip. Your consult confirms the total before we book.",
    category: "Billing",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  name: "Mobile IV therapy (concierge house-call infusion)",
  procedureType: "https://schema.org/PercutaneousProcedure",
  bodyLocation: "Peripheral vein",
  provider: {
    "@type": "MedicalClinic",
    "@id": `${site.url}/#localbusiness`,
    name: site.name,
    url: site.url,
    telephone: site.phoneDisplay,
  },
  areaServed: [
    { "@type": "City", name: "Miami" },
    { "@type": "City", name: "Miami Beach" },
    { "@type": "City", name: "Coral Gables" },
    { "@type": "City", name: "Kendall" },
  ],
  url: `${site.url}/services/mobile-iv-miami`,
};

export default function MobileIvMiamiPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={faqPageJsonLd(faqs)} />

      <ServiceHero
        eyebrow="IV Therapy · Concierge · Miami"
        title="Mobile IV Therapy in Miami. {italic:We come to you}."
        summary="Nurse-administered IV drips at your home, hotel, office, or event. Same medical oversight as our SW Miami clinic, delivered to your door."
        heroImage="/IV infusion.jpg"
        heroImageAlt="Mobile IV therapy in Miami"
        trustChips={["Licensed nurse", "Physician-supervised", "Same-week appointments"]}
        primaryCta={{ label: "Book Your Mobile IV", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
        ctaNote="Groups, events, hotels, and corporate wellness. Call for custom packages."
      />

      <ServiceExpectationBlock
        heading="How it works"
        sessionNote="Book, screen, drip. Full visit is typically 45–90 minutes on-site."
        steps={[
          {
            title: "Book online or call",
            body: "Tell us the location, timing, and what you’re after. We confirm within one business day (often same day).",
          },
          {
            title: "Screening + consent",
            body: "Short intake before we come. Same medical screening as in-clinic. Nothing gets skipped because it’s at your kitchen table.",
          },
          {
            title: "Nurse arrives + drips",
            body: "Licensed nurse sets up in about 10 minutes. Drip runs 30–60 minutes (longer for NAD+). Nurse stays with you the whole time.",
          },
          {
            title: "Clean-up + follow-up",
            body: "Everything packs out with the nurse. You get a follow-up check-in the next day.",
          },
        ]}
        idealForHeading="Perfect for…"
        idealFor={[
          "Post-flight recovery in your hotel room",
          "Wedding parties + bachelorette weekends",
          "Corporate wellness (bring the nurse to the office)",
          "Sports teams and event recovery",
          "Anyone whose calendar makes clinic visits hard",
        ]}
        helpText={{
          title: "Group + corporate packages",
          body: `We handle 4–20 person events regularly. Call ${site.phoneDisplay} for custom pricing, often more affordable than in-clinic when it’s a group of 4+.`,
        }}
      />

      <section className="border-y border-line/80 bg-surface py-16">
        <Container className="max-w-3xl">
          <blockquote>
            <p className="font-display text-2xl leading-relaxed text-ink sm:text-3xl">
              &ldquo;IVs after long flights used to take me days to recover from. Now they come to the
              hotel, I work quietly for an hour, and I’m back to baseline.&rdquo;
            </p>
            <footer className="mt-6 text-sm font-medium text-muted">
              Elena S. · Miami Beach · IV therapy guest
            </footer>
          </blockquote>
        </Container>
      </section>

      <MembershipUpsell service="iv" />

      <section className="py-16">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-3xl text-ink">Common questions</h2>
            <p className="mt-3 text-sm text-muted">
              Groups, hotels, events. Call {site.phoneDisplay} and we’ll build a custom plan.
            </p>
            <Button href={`tel:${site.phoneTel}`} variant="secondary" className="mt-6" size="md">
              Call {site.phoneDisplay}
            </Button>
          </div>
          <div>
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </section>

      <ServiceCTABanner
        variant="dark"
        heading="Ready when you are."
        body="Same-week appointments common. Corporate + event packages available."
        primaryCta={{ label: "Book Your Mobile IV", href: BOOKING_URL }}
        secondaryCta={{ label: `Call ${site.phoneDisplay}`, href: `tel:${site.phoneTel}` }}
      />

      <section className="pb-10">
        <Container className="max-w-3xl">
          <p className="text-xs leading-relaxed text-faint">
            All mobile IV visits are medically supervised. Every visit begins with a short screening
            for contraindications. Not appropriate for all patients. A licensed medical provider
            reviews every booking before we come.
          </p>
        </Container>
      </section>
    </>
  );
}
