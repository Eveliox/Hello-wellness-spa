import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import type { GettingStartedStep } from "@/content/services";

type Props = {
  steps: [GettingStartedStep, GettingStartedStep, GettingStartedStep];
  cta: { label: string; href: string };
};

export function GettingStartedSection({ steps, cta }: Props) {
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
          <Button href={cta.href} size="lg" className="bg-ink px-10 text-white hover:bg-ink/90">
            {cta.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
