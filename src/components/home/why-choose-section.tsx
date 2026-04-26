import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const reasons = [
  {
    title: "Protocols you can understand",
    body: "We favor clear education and informed consent—especially for weight, IV, and peptide pathways—so decisions feel steady, not rushed.",
  },
  {
    title: "A calm, professional clinic",
    body: "Soft neutrals, attentive staff, and treatment rooms designed for privacy and ease.",
  },
  {
    title: "Scheduling that respects you",
    body: "Realistic visit lengths, transparent hours, and reminders that keep your day on track.",
  },
];

export function WhyChooseSection() {
  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          eyebrow="Why choose Hello You Wellness"
          title="Because your health story deserves clarity"
          description="We translate clinical nuance into a plan you can follow—with warmth and accountability."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm">
              <p className="font-display text-2xl text-ink">{r.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{r.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
