import { faqsByIds } from "@/content/faqs";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { Button } from "@/components/ui/button";

const previewIds = ["booking", "free-consult", "payment"];
const preview = faqsByIds(previewIds);

export function FaqPreview() {
  return (
    <section className="py-16">
      <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="space-y-4">
          <SectionHeading
            eyebrow="FAQ"
            title="A few things to know"
            description="Simple answers before your first visit."
          />
          <Button href="/faq" variant="secondary" size="md">
            View all FAQs
          </Button>
        </div>
        <FaqAccordion items={preview} />
      </Container>
    </section>
  );
}
