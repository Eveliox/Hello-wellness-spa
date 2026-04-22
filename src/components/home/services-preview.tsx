import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";

const items = [
  {
    kicker: "Medical Weight Loss",
    title: "Assisted Weight Loss",
    description:
      "Structured GLP-1 and GIP programs with physician oversight, labs, and check-ins built in.",
    href: "/services/assisted-weight-loss",
    image: "/fitness.jpg",
  },
  {
    kicker: "IV Therapy",
    title: "IV Infusions & Boosters",
    description:
      "Physician-curated blends — NAD+, Myers' Cocktail, Glutathione — administered in a calm, private suite.",
    href: "/services/iv-therapy",
    image: "/IV infusion.jpg",
  },
  {
    kicker: "Aesthetics",
    title: "Skin & Aesthetics",
    description:
      "Natural-ethos refinement. Botox, fillers, and advanced skin treatments.",
    href: "/services/aesthetics-cosmetics",
    image: "/skin.jpg",
  },
  {
    kicker: "Hormone Health",
    title: "Hormone Therapy",
    description: "Coordinated hormone care aligned with your broader wellness plan.",
    href: "/services",
    image: "/hormone.jpg",
  },
  {
    kicker: "Research Peptides",
    title: "Peptide Programs",
    description:
      "GHK-Cu, BPC-157, and more — clearly labeled, properly documented research compounds.",
    href: "/store?category=Peptides%20(Research%20Use%20Only)",
    image: "/peptides.jpg",
  },
] as const;

export function ServicesPreview() {
  const [first, second, ...rest] = items;

  return (
    <section className="border-b border-line/80 bg-canvas py-20">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
              <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
              Our services
            </p>
            <h2 className="font-display text-4xl text-balance text-ink sm:text-5xl">
              Everything your body{" "}
              <span className="font-script text-[1.3em] font-normal italic leading-none text-[#E8B4A3]">
                needs
              </span>
              , under one roof.
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink hover:border-ink/40"
          >
            View all services →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <ServiceCard item={first} />
          <ServiceCard item={second} />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {rest.map((item) => (
            <ServiceCard key={item.title} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}

type ServiceItem = (typeof items)[number];

function ServiceCard({ item }: { item: ServiceItem }) {
  return (
    <article className="group overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-sm transition hover:shadow-soft">
      <div className="relative aspect-[16/10] bg-white">
        <Image
          src={item.image}
          alt={item.title}
          fill
          loading="lazy"
          className="object-cover"
          sizes="(min-width: 768px) 40vw, 100vw"
        />
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E8B4A3]">
          {item.kicker}
        </p>
        <p className="mt-3 font-display text-2xl text-ink">{item.title}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
        <Link
          href={item.href}
          className="mt-5 inline-flex text-sm font-semibold text-ink underline-offset-2 hover:underline"
        >
          Learn more →
        </Link>
      </div>
    </article>
  );
}
