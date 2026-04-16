import { testimonials } from "@/content/testimonials";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialsSection } from "@/components/testimonials/testimonials-section";
import { Button } from "@/components/ui/button";

export function TestimonialsHome() {
  return (
    <section className="bg-surface py-16">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Testimonials"
            title="Guests describe the feeling better than we ever could"
            description="Every review reflects a real visit—edited only for privacy."
          />
          <Button href="/testimonials" variant="secondary" className="self-start sm:self-auto">
            Read more stories
          </Button>
        </div>
        <div className="mt-8 md:hidden">
          <TestimonialsSection items={testimonials} variant="carousel" />
        </div>
        <div className="mt-8 hidden md:block">
          <TestimonialsSection items={testimonials} variant="grid" />
        </div>
      </Container>
    </section>
  );
}
