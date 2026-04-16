import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function TrustSection() {
  return (
    <section className="border-b border-line/80 bg-canvas py-14">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Why guests trust us"
          title="Medical depth. Spa calm. Zero clutter."
          description="Hello You Wellness Center is built for clients who want clear answers, honest timelines, and providers who respect your time."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {site.trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-sm"
            >
              <p className="font-ui text-sm font-semibold text-ink">{badge.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{badge.detail}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
