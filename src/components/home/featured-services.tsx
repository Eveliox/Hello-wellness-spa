import { services } from "@/content/services";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/services/service-card";
import { Button } from "@/components/ui/button";

export function FeaturedServices() {
  const featured = services;
  return (
    <section className="py-16">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Services"
            title="Care pathways designed for clarity"
            description="Each journey begins with listening. From there, we recommend only what aligns with your goals, anatomy, and lifestyle."
          />
          <Button href="/services" variant="secondary" className="self-start sm:self-auto">
            View all services
          </Button>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {featured.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Container>
    </section>
  );
}
