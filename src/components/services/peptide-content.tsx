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
        <div className="sticky top-0 z-40 -mx-4 border-b border-line bg-surface/95 px-4 py-4 backdrop-blur sm:-mx-0 sm:rounded-2xl sm:border sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">Research-use notice</p>
          <p className="mt-2 text-sm text-muted">
            All peptide products sold by Hello You Wellness Center are intended strictly for in-vitro research and
            laboratory use only. These products are not intended for human or animal consumption, and are not drugs,
            foods, or cosmetics. They are not to be used for diagnostic, therapeutic, or any form of clinical
            application. By purchasing from this store, you acknowledge and agree that these products will be used
            exclusively for legitimate research purposes.
          </p>
        </div>
        <h2 className="mt-10 font-display text-3xl text-ink">Peptide catalog preview</h2>
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
