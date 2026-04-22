import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { Testimonial } from "@/content/testimonials";

type Props = { testimonialItems: Testimonial[] };

export function ByoIvContent({ testimonialItems }: Props) {
  return (
    <section className="border-y border-line/80 bg-surface py-16">
      <Container>
        <Reveal>
          <h2 className="font-display text-3xl text-ink">Guests who chose this pathway</h2>
          <p className="mt-2 text-sm text-muted">What our guests are saying</p>
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonialItems.map((t, idx) => (
            <Reveal key={`${t.name}-${idx}`} delayMs={60 + idx * 60}>
              <article className="relative h-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-sm">
                <div className="mb-3 text-sm text-[#D4A017]" aria-hidden>★★★★★</div>
                <div className="pointer-events-none absolute -left-2 -top-6 text-[72px] leading-none text-ink/5" aria-hidden>"</div>
                <p className="relative text-sm leading-relaxed text-muted">"{t.quote}"</p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-muted">{t.detail}</p>
                  </div>
                  <span className="rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                    {t.service}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
