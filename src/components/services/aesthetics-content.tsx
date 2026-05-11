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
    name: "PDO threads",
    description:
      "Non-surgical lift and collagen stimulation using dissolvable PDO threads. Subtle definition without downtime.",
    startingAt: "By consultation",
    cta: "Learn more",
  },
  {
    name: "Endolift",
    description:
      "Laser-fiber treatment for skin tightening, fat reduction, and contour refinement on face, neck, and body.",
    startingAt: "By consultation",
    cta: "Learn more",
  },
  {
    name: "Non-surgical BBL",
    description:
      "Biostimulator-based contouring for natural-looking lift and definition — no incisions, no recovery.",
    startingAt: "By consultation",
    cta: "Learn more",
  },
  {
    name: "Cellulite reduction",
    description:
      "Targeted treatments to smooth dimpling and improve skin texture on hips, thighs, and arms.",
    startingAt: "By consultation",
    cta: "Learn more",
  },
  {
    name: "Signature facial",
    description: "Customized facial treatment tailored to your skin type, concerns, and goals. 60 minutes of focused care.",
    startingAt: "$129",
    cta: "Learn more",
  },
  {
    name: "TRT (Testosterone Replacement Therapy)",
    description:
      "Physician-guided testosterone therapy for men experiencing low T. Includes lab work, evaluation, and ongoing oversight.",
    startingAt: "$499/program",
    cta: "Check if you qualify",
  },
  {
    name: "Mobile IV therapy",
    description:
      "On-site IV hydration and nutrient drips at your home, hotel, or office across Miami-Dade.",
    startingAt: "By consultation",
    cta: "Book now",
  },
  {
    name: "Mobile phlebotomy",
    description:
      "Licensed blood draws and lab collections at your location — convenient, professional, and discreet.",
    startingAt: "By consultation",
    cta: "Book now",
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

      <section className="py-12">
        <Container>
          <Reveal>
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 sm:p-10">
              <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C0392B]">
                    Education & Training
                  </p>
                  <h2 className="mt-3 font-display text-2xl text-ink sm:text-3xl">
                    We teach the next generation of providers
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                    Through our Academy, our team trains licensed professionals in advanced aesthetic and injection
                    techniques. The same hands teaching this work are the hands treating you — every appointment is
                    backed by hours of clinical instruction.
                  </p>
                </div>
                <a
                  href="https://www.instagram.com/xlashbyyaneacademy_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-ink bg-white px-5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
                >
                  Visit the Academy <span aria-hidden className="ml-2">→</span>
                </a>
              </div>
            </div>
          </Reveal>
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
