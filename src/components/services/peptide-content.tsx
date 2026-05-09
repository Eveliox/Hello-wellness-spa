import Image from "next/image";
import { Container } from "@/components/ui/container";

const peptideSpotlight = [
  {
    title: "GHK‑Cu",
    image: "/images/boosters/ghk.png",
    note: "Peptides are always discussed with screening and oversight.",
  },
] as const;

export function PeptideContent() {
  return (
    <section className="border-y border-line/80 bg-surface py-16">
      <Container>
        <h2 className="font-display text-3xl text-ink">Peptide catalog preview</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Example items shown for merchandising and layout only. Product availability, documentation, and checkout
          flow are configured separately.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {peptideSpotlight.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl text-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.note}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
