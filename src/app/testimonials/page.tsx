import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { testimonials } from "@/content/testimonials";
import { Container } from "@/components/ui/container";
import { TestimonialsSection } from "@/components/testimonials/testimonials-section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = createMetadata({
  title: "Testimonials",
  description: `Read verified guest stories about ${site.name}—Miami med spa experiences focused on trust and results.`,
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return (
    <>
      <section className="border-b border-line/80 bg-surface py-14">
        <Container className="max-w-3xl">
          <h1 className="font-display text-4xl text-balance text-ink sm:text-5xl">Stories from our studio guests</h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Replace sample quotes with your own verified testimonials. We recommend pairing each quote with city
            neighborhood (not full address) for local SEO warmth.
          </p>
          <div className="mt-8">
            <Button href={`tel:${site.phoneTel}`} size="lg">
              Call {site.phoneDisplay}
            </Button>
            <Button href={site.social.instagram} variant="secondary" size="lg">
              Instagram
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <TestimonialsSection items={testimonials} variant="grid" />
        </Container>
      </section>
    </>
  );
}
