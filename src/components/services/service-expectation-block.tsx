import { Container } from "@/components/ui/container";

export type ServiceExpectationStep = {
  title: string;
  body: string;
};

export type ServiceExpectationBlockProps = {
  /** Heading over the steps column. Defaults to "What you can expect". */
  heading?: string;
  /** Small paragraph under the heading. */
  sessionNote?: string;
  /** Numbered step cards. Typically 3–5 items. */
  steps: ServiceExpectationStep[];
  /** Heading for the right-column card. Defaults to "Ideal for guests who want…". */
  idealForHeading?: string;
  /** Bulleted checklist items in the right-column card. */
  idealFor: string[];
  /** Optional help block at the bottom of the right column. */
  helpText?: { title: string; body: string };
};

export function ServiceExpectationBlock({
  heading = "What you can expect",
  sessionNote,
  steps,
  idealForHeading = "Ideal for guests who want…",
  idealFor,
  helpText,
}: ServiceExpectationBlockProps) {
  return (
    <section className="py-16">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <h2 className="font-display text-3xl text-ink">{heading}</h2>
          {sessionNote ? <p className="mt-3 text-sm text-muted">{sessionNote}</p> : null}

          <div className="mt-8 space-y-4">
            {steps.map((step, idx) => (
              <div
                key={step.title}
                className="rounded-3xl border border-line bg-surface p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 text-sm font-semibold text-accent-brand">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <p className="font-ui text-sm font-semibold text-ink">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[var(--radius-card)] border border-line border-l-[3px] border-l-accent-brand bg-surface-warm p-6 shadow-sm">
          <h3 className="font-display text-2xl text-ink">{idealForHeading}</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {idealFor.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-1 text-ink" aria-hidden>
                  ✓
                </span>
                {line}
              </li>
            ))}
          </ul>
          {helpText ? (
            <div className="mt-8 rounded-2xl bg-accent-soft/50 p-4 text-sm text-muted">
              <p className="font-semibold text-ink">{helpText.title}</p>
              <p className="mt-2">{helpText.body}</p>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
