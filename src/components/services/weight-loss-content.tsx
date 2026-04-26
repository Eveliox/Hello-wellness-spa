import { Container } from "@/components/ui/container";
import type { Testimonial } from "@/content/testimonials";

type Props = { testimonialItems: Testimonial[] };

export function WeightLossContent({ testimonialItems }: Props) {
  return (
    <section className="border-y border-line/80 bg-surface py-16">
      <Container>
        <h2 className="font-display text-3xl text-ink">What our guests are saying</h2>
        <div className="mt-8">
          <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:snap-none md:overflow-visible md:px-0 md:pb-0 md:grid-cols-3">
            {testimonialItems.map((t) => (
              <figure
                key={t.id}
                className="w-[min(92vw,26rem)] shrink-0 snap-start rounded-3xl border border-line bg-surface p-6 shadow-sm md:w-auto"
              >
                <div className="mb-3 flex gap-1" aria-label="5 star rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-[#C0392B]" aria-hidden>★</span>
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-muted">"{t.quote}"</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-ink">{t.name}</figcaption>
                <p className="text-xs text-faint">{t.detail}</p>
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
