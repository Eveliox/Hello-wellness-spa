import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export type ProgramExpectationStep = { title: string; body: string };

export type ProgramExpectationProps = {
  heading?: string;
  sessionNote?: string;
  steps: ProgramExpectationStep[];
  idealForHeading?: string;
  idealFor: string[];
  locale?: "en" | "es";
};

/**
 * Program "How it works" — 3 oversized blue numerals with reveal stagger,
 * plus a compact "ideal for" list below. Numerals animate on scroll-in
 * (via <Reveal>), body copy stays static per the motion rule.
 */
export function ProgramExpectation({
  heading,
  sessionNote,
  steps,
  idealForHeading,
  idealFor,
  locale = "en",
}: ProgramExpectationProps) {
  const defaultHeading = locale === "es" ? "Qué esperar" : "What to expect";
  const defaultIdealHeading = locale === "es" ? "Ideal para" : "Ideal for";

  return (
    <section className="bg-canvas py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent-clinical">
              {locale === "es" ? "Cómo funciona" : "How it works"}
            </p>
            <h2 className="mt-3 font-display text-4xl text-balance text-ink sm:text-5xl">
              {heading ?? defaultHeading}
            </h2>
            {sessionNote ? (
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted text-pretty">
                {sessionNote}
              </p>
            ) : null}
          </div>

          <ol className="space-y-8">
            {steps.map((step, idx) => (
              <Reveal key={step.title} delayMs={idx * 100}>
                <div className="grid grid-cols-[4rem_1fr] gap-6 border-t border-line pt-6">
                  <span
                    className="font-display text-[3rem] leading-none text-accent-clinical/85 tabular-nums"
                    aria-hidden
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-display text-xl text-ink">{step.title}</p>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-muted text-pretty">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="mt-20 border-t border-line pt-10">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent-clinical">
            {idealForHeading ?? defaultIdealHeading}
          </p>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {idealFor.map((line) => (
              <li
                key={line}
                className="flex gap-3 text-[0.95rem] leading-relaxed text-ink text-pretty"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-clinical"
                  aria-hidden
                />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
