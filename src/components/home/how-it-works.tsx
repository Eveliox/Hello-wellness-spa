import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Medical intake",
    description:
      "Answer questions about your health history, lifestyle, and goals. 100% online and confidential.",
  },
  {
    title: "Provider review",
    description:
      "A licensed APRN reviews your intake and determines the right GLP-1 protocol for you.",
  },
  {
    title: "Personalized plan",
    description:
      "Receive a customized treatment plan with clear dosing guidance — delivered right to your door.",
  },
  {
    title: "Ongoing support",
    description:
      "Regular check-ins, dosage adjustments, and direct access to your care team whenever you need it.",
  },
];

const phoneOptions = ["5 – 20 lbs.", "21 – 50 lbs.", "51+ lbs.", "Not sure, I just need help"];

export function HowItWorks() {
  return (
    <section className="border-b border-line/80 bg-canvas py-20">
      <Container className="grid gap-16 lg:grid-cols-2 lg:items-center">
        {/* Steps */}
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
              <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
              How it works
            </p>
            <h2 className="font-display text-4xl text-balance text-ink sm:text-5xl">
              Your path to{" "}
              <span className="font-script text-[1.3em] font-normal italic leading-none text-[#E8B4A3]">
                lasting
              </span>{" "}
              results.
            </h2>
            <p className="max-w-md text-base leading-relaxed text-muted">
              Our GLP-1 weight loss program pairs FDA-approved medication with licensed provider
              oversight — no guesswork, no gimmicks.
            </p>
          </div>

          <ol className="space-y-7">
            {steps.map((step, i) => (
              <li key={step.title} className="flex items-start gap-5">
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-ink"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <Button href="/intake/glp1" size="lg" className="bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90">
            Start your intake →
          </Button>
        </div>

        {/* Phone mockup */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-64 sm:w-72">
            <div className="overflow-hidden rounded-[2.5rem] border-[7px] border-[#1a1a1a] bg-white shadow-[0_24px_64px_rgba(22,22,22,0.18)]">
              {/* Status bar */}
              <div className="flex items-center justify-between bg-white px-5 pb-1 pt-3 text-[11px] font-semibold text-ink">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <svg width="15" height="11" viewBox="0 0 15 11" aria-hidden="true">
                    <path
                      d="M7.5 2.5C9.8 2.5 11.9 3.4 13.4 4.9L15 3.3C13.1 1.3 10.4 0 7.5 0S1.9 1.3 0 3.3L1.6 4.9C3.1 3.4 5.2 2.5 7.5 2.5Z"
                      fill="#212020"
                      opacity=".4"
                    />
                    <path
                      d="M7.5 5C9 5 10.4 5.6 11.4 6.6L13 5C11.6 3.6 9.6 2.7 7.5 2.7S3.4 3.6 2 5L3.6 6.6C4.6 5.6 6 5 7.5 5Z"
                      fill="#212020"
                      opacity=".7"
                    />
                    <circle cx="7.5" cy="10" r="1.5" fill="#212020" />
                  </svg>
                  <svg width="22" height="11" viewBox="0 0 22 11" aria-hidden="true">
                    <rect
                      x="0.5"
                      y="0.5"
                      width="18"
                      height="10"
                      rx="2"
                      stroke="#212020"
                      strokeOpacity=".35"
                      fill="none"
                    />
                    <rect x="2" y="2" width="14" height="7" rx="1" fill="#212020" opacity=".9" />
                    <path d="M19.5 3.5v4a1.5 1.5 0 0 0 0-4Z" fill="#212020" opacity=".4" />
                  </svg>
                </div>
              </div>

              {/* App content */}
              <div className="space-y-5 px-5 pb-7 pt-2">
                <p className="text-center font-display text-[1.35rem] tracking-tight text-ink">
                  hello{" "}
                  <span className="font-script text-[1.3em] font-normal italic leading-none text-[#E8B4A3]">
                    you
                  </span>
                  .
                </p>

                <div className="h-1 w-full overflow-hidden rounded-full bg-accent-soft">
                  <div className="h-full w-2/5 rounded-full bg-ink" />
                </div>

                <p className="text-balance text-[0.95rem] font-semibold leading-snug text-ink">
                  What&apos;s Your Weight Loss Goal?
                </p>

                <div className="space-y-2.5">
                  {phoneOptions.map((opt) => (
                    <div
                      key={opt}
                      className="rounded-lg border border-line px-3.5 py-2.5 text-[0.8rem] text-ink"
                    >
                      {opt}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-1">
                  <span className="flex-1 rounded-full border border-line py-2 text-center text-[0.8rem] font-semibold text-ink">
                    Back
                  </span>
                  <span className="flex-1 rounded-full bg-[#1a1a1a] py-2 text-center text-[0.8rem] font-semibold text-white">
                    Next
                  </span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-6 rounded-[var(--radius-card)] bg-[#E8B4A3] px-4 py-3 shadow-soft">
              <p className="font-display text-2xl leading-none text-ink">100%</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/80">
                Online intake
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
