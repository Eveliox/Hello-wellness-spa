import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { Testimonial } from "@/content/testimonials";

const ivMenu = [
  {
    name: "Myers' Cocktail",
    description:
      "The classic. B-vitamins, Vitamin C, magnesium, and calcium for energy, immunity, and overall wellness.",
    duration: "45 min",
    price: "$199",
    cta: "Book this IV",
  },
  {
    name: "NAD+ Infusion",
    description:
      "High-dose NAD+ for cellular repair, mental clarity, and metabolic support. Our most requested drip.",
    duration: "60–90 min",
    price: "$399",
    cta: "Book this IV",
  },
  {
    name: "Glutathione IV Push",
    description: "The master antioxidant. Quick 15-minute push for detox support and skin brightening.",
    duration: "15 min",
    price: "$99",
    cta: "Book this IV",
  },
  {
    name: "Build Your Own IV",
    description: "Start with a base and customize. Choose your vitamins, minerals, and add-ons with your clinician.",
    duration: "45–60 min",
    price: "Starting at $149",
    cta: "Book a consultation",
  },
] as const;

const ivExperience = [
  {
    title: "Private lounge setting",
    body: "Recline in a quiet, comfortable space — not a busy clinic hallway.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
        <path
          d="M4 13V7a2 2 0 0 1 2-2h7a4 4 0 0 1 4 4v4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 13h15a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 17v2m10-2v2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "45–60 minutes, door to door",
    body: "Most sessions fit into a lunch break. Walk in, drip, walk out refreshed.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
        <path
          d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 6v6l4 2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Nurse-monitored throughout",
    body: "A licensed nurse stays attentive to your comfort and response the entire time.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
        <path
          d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 8v6m-3-3h6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;

type Props = { bookingUrl: string; testimonialItems: Testimonial[] };

export function IvTherapyContent({ bookingUrl, testimonialItems }: Props) {
  return (
    <>
      <section className="py-16">
        <Container>
          <Reveal>
            <h2 className="font-display text-3xl text-ink">Our IV blends</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted">
              Each infusion is mixed on-site with medical-grade ingredients. 45-60 minutes in a private lounge setting.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {ivMenu.map((iv, idx) => (
              <Reveal key={iv.name} delayMs={60 + idx * 60}>
                <div className="group flex h-full flex-col rounded-[12px] border border-line bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="font-display text-xl text-ink">{iv.name}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{iv.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted">
                      {iv.duration}
                    </span>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <p className="text-lg font-semibold text-ink">{iv.price}</p>
                    <Button
                      href={bookingUrl}
                      variant="ghost"
                      size="sm"
                      className="border border-line bg-transparent text-ink shadow-none hover:border-ink/20 hover:bg-black/[0.03]"
                    >
                      {iv.cta}
                    </Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line/80 bg-surface py-12">
        <Container>
          <div className="grid gap-10 md:grid-cols-3">
            {ivExperience.map((b, idx) => (
              <Reveal key={b.title} delayMs={40 + idx * 60}>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 text-ink">{b.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{b.title}</p>
                    <p className="mt-1 text-sm text-muted">{b.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
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
