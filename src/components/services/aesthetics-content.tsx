import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { Testimonial } from "@/content/testimonials";
import type { ServiceContent } from "@/content/services";

const aestheticsServices = [
  {
    name: "Botox & neurotoxin",
    description:
      "Targeted wrinkle reduction with conservative technique. We prioritize natural movement — you'll still look like you.",
    startingAt: "$12/unit",
    cta: "Book now",
  },
  {
    name: "Dermal fillers",
    description:
      "Restore volume and contour with hyaluronic acid fillers. Lips, cheeks, jawline, and under-eyes — placed with precision.",
    startingAt: "$650/syringe",
    cta: "Learn more",
  },
  {
    name: "Morpheus8 RF microneedling",
    description:
      "Radiofrequency microneedling for skin tightening, texture improvement, and collagen stimulation. Face and body.",
    startingAt: "$799/session",
    cta: "Learn more",
  },
  {
    name: "Signature facial",
    description: "Customized facial treatment tailored to your skin type, concerns, and goals. 60 minutes of focused care.",
    startingAt: "$129",
    cta: "Learn more",
  },
  {
    name: "Vaginal rejuvenation",
    description: "Non-surgical feminine wellness treatments. Private consultations in a comfortable, judgment-free setting.",
    cta: "Schedule a consultation",
  },
] as const;

const aestheticsResults = [
  {
    title: "Forehead & frown lines",
    body: "After neurotoxin: smoothed tension lines while preserving natural brow movement. Most guests see full results within 10-14 days.",
  },
  {
    title: "Cheek & midface volume",
    body: "After filler: restored contour and lift without looking puffy or overfilled. Results are immediate with final settling at 2 weeks.",
  },
  {
    title: "Skin texture & tone",
    body: "After Morpheus8: tighter, smoother skin with reduced pore size and fine lines. Results develop over 4-6 weeks as collagen rebuilds.",
  },
] as const;

type Props = {
  service: ServiceContent;
  bookingUrl: string;
  testimonialItems: Testimonial[];
};

export function AestheticsContent({ service, bookingUrl, testimonialItems }: Props) {
  return (
    <>
      <section className="py-16">
        <Container>
          <Reveal>
            <h2 className="font-display text-3xl text-ink">Our aesthetics services</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">Each treatment is tailored to your anatomy and goals.</p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {aestheticsServices.map((s, idx) => (
              <Reveal key={s.name} delayMs={60 + idx * 40}>
                <a
                  href={bookingUrl}
                  className="group block h-full rounded-[12px] border border-line bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
                >
                  <p className="font-display text-xl text-ink">{s.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>
                  {"startingAt" in s && s.startingAt ? (
                    <p className="mt-4 text-[15px] font-semibold text-ink">Starting at {s.startingAt}</p>
                  ) : null}
                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline-offset-4 group-hover:underline">
                      {s.cta}
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line/80 bg-surface py-16">
        <Container>
          <Reveal>
            <h2 className="font-display text-3xl text-ink">What results look like</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">Subtle changes that add up to a visible difference.</p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {aestheticsResults.map((card, idx) => (
              <Reveal key={card.title} delayMs={60 + idx * 60}>
                <div className="h-full rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-sm">
                  <p className="font-display text-xl text-ink">{card.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{card.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delayMs={120}>
            <div className="mt-8">
              <a className="text-sm font-semibold text-ink underline-offset-4 hover:underline" href={bookingUrl}>
                Book a consultation to discuss your goals <span aria-hidden>→</span>
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

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
    </>
  );
}
