import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/services/service-card";
import { Button } from "@/components/ui/button";
import { TrustChip } from "@/components/ui/trust-chip";

export const metadata: Metadata = createMetadata({
  title: "Services",
  description: `Explore assisted weight loss, aesthetics, IV therapy, BYO IV, and peptides at ${site.name} in Miami.`,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-line/80 bg-surface py-14">
        <Container className="max-w-3xl">
          <TrustChip>Services overview</TrustChip>
          <h1 className="mt-4 font-display text-4xl text-balance text-ink sm:text-5xl">
            Choose a pathway. We handle the choreography.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Every service line shares the same promise: medical credibility, feminine calm, and copy you can
            understand without a dictionary.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`tel:${site.phoneTel}`} size="lg">
              Call {site.phoneDisplay}
            </Button>
            <Button href={site.social.instagram} variant="secondary" size="lg">
              Instagram
            </Button>
            <Button href="/faq" variant="secondary" size="lg">
              Read FAQs
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="Full menu"
            title="Medical aesthetics, infusion therapy, and guided weight care"
            description="Peptides are available in a research-only catalog with clear labeling and handling guidance."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
