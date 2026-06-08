import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GLP1_PLAN_LIST } from "@/content/glp1-plans";

export function WeightLossPlans() {
  return (
    <section className="border-b border-line/80 bg-canvas py-16">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C0392B]">Pricing</p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Transparent pricing. No hidden fees.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Most patients begin at the Starter tier and move up as their provider escalates dose.
            Pricing covers medication, B12, provider visits, and program coaching — billed monthly,
            cancel anytime.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {GLP1_PLAN_LIST.map((plan, idx) => {
            const isActive = plan.key === "active";
            return (
              <article
                key={plan.key}
                className={[
                  "relative flex flex-col rounded-[var(--radius-card)] border p-6 shadow-sm",
                  isActive
                    ? "border-[#C0392B]/50 bg-white ring-1 ring-[#C0392B]/30"
                    : "border-line bg-white",
                ].join(" ")}
              >
                {isActive ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#C0392B] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                    Most chosen
                  </span>
                ) : null}

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Tier {idx + 1} · {plan.label}
                </p>
                <h3 className="mt-1 font-display text-2xl text-ink">{plan.tagline}</h3>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-4xl text-ink">${plan.price}</span>
                  <span className="text-sm text-muted">/mo</span>
                </div>
                <p className="mt-1 text-xs text-faint">
                  {plan.months} · Dose: {plan.dose}
                </p>

                <ul className="mt-6 space-y-2.5 text-sm text-muted">
                  {plan.highlights.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C0392B]" aria-hidden />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <Button
                    href="/intake/glp1"
                    size="md"
                    className={
                      isActive
                        ? "w-full bg-[#C0392B] text-white hover:bg-[#C0392B]/90"
                        : "w-full bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90"
                    }
                  >
                    Check if you qualify
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-faint">
          Not sure which tier fits? Start with the 3-minute intake — we&apos;ll recommend a plan based
          on your history and goals. A licensed APRN reviews every submission before any medication
          is prescribed.
        </p>
      </Container>
    </section>
  );
}
