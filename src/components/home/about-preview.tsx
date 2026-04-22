import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const bullets = [
  "Licensed APRNs under physician supervision",
  "Comprehensive intake & lab review before treatment",
  "Ongoing check-ins and protocol adjustments",
  "Private SW Miami location with easy parking",
];

export function AboutPreview() {
  return (
    <section className="border-y border-line/80 bg-surface py-20">
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="relative order-1 lg:order-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&q=80&auto=format&fit=crop"
              alt="Hello You Wellness Center studio"
              fill
              loading="lazy"
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
          <div className="absolute -bottom-6 right-4 w-40 rounded-[var(--radius-card)] bg-[#E8B4A3] p-5 text-ink shadow-soft sm:right-8">
            <p className="font-display text-4xl leading-none">5+</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink/80">
              Years serving
              <br />
              Miami clients
            </p>
          </div>
        </div>

        <div className="order-2 space-y-6 lg:order-2">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
            <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
            About us
          </p>
          <h2 className="font-display text-4xl text-balance text-ink sm:text-5xl">
            Medical expertise.{" "}
            <span className="font-script text-[1.3em] font-normal italic leading-none text-[#E8B4A3]">
              Personal
            </span>{" "}
            attention.
          </h2>
          <p className="text-base leading-relaxed text-muted">
            Hello You Wellness Center was built for clients who want real answers from licensed professionals — not
            scripts, not sales pitches, and not one-size-fits-all plans.
          </p>
          <ul className="space-y-3 text-sm text-ink">
            {bullets.map((item) => (
              <li key={item} className="flex items-center gap-4">
                <span className="h-px w-6 shrink-0 bg-[#E8B4A3]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <Button
            href="/about"
            size="lg"
            className="bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90"
          >
            Meet the team →
          </Button>
        </div>
      </Container>
    </section>
  );
}
