import Image from "next/image";
import { Container } from "@/components/ui/container";

const ivAddOns = [
  {
    title: "NAD+",
    image: "/images/boosters/nad-plus.jpg",
    note: "Cellular energy and mental clarity support",
    price: "$150 add-on",
    builderKey: "nad",
  },
  {
    title: "Glutathione",
    image: "/images/boosters/gluta.png",
    note: "Antioxidant and detox support",
    price: "$35 add-on",
    builderKey: "glutathione",
  },
  {
    title: "L‑Carnitine",
    image: "/images/boosters/l-carnitine.png",
    note: "Fat metabolism and energy production",
    price: "$25 add-on",
    builderKey: "l-carnitine",
  },
  {
    title: "Lipotropic (MIC)",
    image: "/images/boosters/lipotropic.png",
    note: "MIC complex for metabolic support",
    price: "$45 add-on",
    builderKey: "lipotropic",
  },
  {
    title: "Ipamorelin",
    image: "/images/boosters/ipa.png",
    note: "Growth hormone peptide — discuss with your provider",
    price: "$75 add-on",
    builderKey: "ipamorelin",
  },
] as const;

type Props = { isByoIvPage: boolean; serviceSlug: string };

export function IvAddOnsSection({ isByoIvPage, serviceSlug }: Props) {
  return (
    <section className="border-y border-line/80 bg-surface py-16">
      <Container>
        <h2 className="font-display text-3xl text-ink">Popular add-ons</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Choose what aligns with your goals—we'll confirm what's appropriate during intake and keep your blend
          transparent.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ivAddOns.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-sm"
            >
              <div className="p-5 pb-0">
                <div className="relative aspect-square overflow-hidden rounded-[12px] bg-[#f5f4f2]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl text-ink">{item.title}</h3>
                <p className="mt-1 text-sm font-semibold text-ink/85">{item.price}</p>
                <p className="mt-2 text-sm text-muted">{item.note}</p>
                {isByoIvPage ? (
                  <a
                    className="mt-4 inline-flex text-sm font-semibold text-ink underline-offset-4 hover:underline"
                    href={`/services/${serviceSlug}?addon=${encodeURIComponent(item.builderKey)}#iv-builder`}
                  >
                    Add to your blend <span aria-hidden>↑</span>
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
