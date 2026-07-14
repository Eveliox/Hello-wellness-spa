import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { TrackedCtaLink } from "@/components/analytics/tracked-cta-link";
import type { GettingStartedStep, ServiceSlug } from "@/content/services";

type Props = {
  steps: [GettingStartedStep, GettingStartedStep, GettingStartedStep];
  cta: { label: string; href: string };
  /** Passed through to `book_click` so we can segment which service page the CTA fired from. */
  serviceSlug?: ServiceSlug;
};

/**
 * Map service slug + CTA href into the analytics booking_service bucket.
 * Falls back to "general" for non-booking hrefs (e.g. #iv-builder anchor or
 * /intake for peptide registration — which isn't strictly a booking).
 */
function bookingServiceFor(serviceSlug: ServiceSlug | undefined): string {
  switch (serviceSlug) {
    case "assisted-weight-loss":
      return "weight";
    case "aesthetics-cosmetics":
      return "aesthetics";
    case "iv-therapy":
    case "build-your-own-iv":
      return "iv";
    default:
      return "general";
  }
}

export function GettingStartedSection({ steps, cta, serviceSlug }: Props) {
  return (
    <section className="border-y border-line/80 bg-surface py-16">
      <Container>
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">How it works</p>
          <h2 className="mt-2 font-display text-3xl text-ink">Getting Started Is Easy</h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delayMs={i * 80}>
              <div className="relative flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                  {i + 1}
                </div>
                <h3 className="font-display text-xl text-ink">
                  Step {i + 1}: {step.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <TrackedCtaLink
            href={cta.href}
            eventName="book_click"
            eventParams={{
              cta_location: `service_page_getting_started${serviceSlug ? `_${serviceSlug}` : ""}`,
              booking_service: bookingServiceFor(serviceSlug),
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-10 text-[0.95rem] font-semibold tracking-wide text-white transition duration-200 hover:bg-ink/90"
          >
            {cta.label}
          </TrackedCtaLink>
        </div>
      </Container>
    </section>
  );
}
