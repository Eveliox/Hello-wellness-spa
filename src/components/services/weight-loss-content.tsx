import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { Testimonial } from "@/content/testimonials";

const weightLossGallery = [
  {
    title: "Program overview",
    image: "/images/assisted-weight-loss/weightloss.webp",
    note: "A calm, structured pathway with clear next steps.",
    startingAt: "$145",
  },
  {
    title: "Medication options",
    image: "/images/assisted-weight-loss/glp-1.webp",
    note: "Discussed with your provider and guided by your history and goals.",
    startingAt: "$199",
  },
  {
    title: "GLP collection",
    image: "/images/assisted-weight-loss/glp.webp",
    note: "Every plan is individualized—your care stays legible and documented.",
    startingAt: "$299",
  },
] as const;

const weightLossPricing = [
  { name: "GLP-1 Program", initial: "$280", sale: "$199" },
  { name: "GLP-1/GIP Program", initial: "$420", sale: "$299" },
  { name: "4 Weeks Personalized Program", initial: "$390", sale: "$145" },
] as const;

type Props = { bookingUrl: string; testimonialItems: Testimonial[] };

export function WeightLossContent({ bookingUrl, testimonialItems }: Props) {
  return (
    <>
      <section className="border-y border-line/80 bg-surface py-16">
        <Container>
          <h2 className="font-display text-3xl text-ink">A program designed to feel clear</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            High-touch support, straightforward language, and a plan you can follow—without the noise.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {weightLossGallery.map((item) => (
              <a
                key={item.title}
                href="#program-options"
                className="group block overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
              >
                <div className="relative aspect-[4/3] bg-white">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain p-6"
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-ink/85">Starting at {item.startingAt}</p>
                  <p className="mt-2 text-sm text-muted">{item.note}</p>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>

      <section id="program-options" className="py-16 scroll-mt-24">
        <Container>
          <Reveal>
            <h2 className="font-display text-3xl text-ink">Program options</h2>
            <p className="mt-2 text-sm text-muted">Transparent pricing with no hidden fees.</p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {weightLossPricing.map((p, i) => (
              <Reveal key={p.name} delayMs={60 + i * 60}>
                <div className="flex h-full flex-col rounded-[var(--radius-card)] bg-[#1a1a1a] p-6 text-white shadow-[0_20px_55px_rgba(0,0,0,0.25)]">
                  <p className="font-display text-xl">{p.name}</p>
                  <div className="mt-4 flex items-baseline gap-3">
                    <p className="text-sm text-white/55 line-through">{p.initial}</p>
                    <p className="text-3xl font-semibold text-[#C0392B]">{p.sale}</p>
                  </div>
                  <p className="mt-3 text-sm text-white/70">
                    Includes an initial visit and a personalized plan with clear next steps.
                  </p>
                  <Button href={bookingUrl} size="md" className="mt-6 w-full bg-white text-ink hover:bg-white/90">
                    Get Started
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

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
    </>
  );
}
