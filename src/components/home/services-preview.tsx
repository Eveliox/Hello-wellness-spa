import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const items = [
  {
    title: "Assisted Weight Loss",
    description: "Structured medical weight management with clear next steps.",
    href: "/services/assisted-weight-loss",
    image: "/images/products/glp-1-program.jpg",
  },
  {
    title: "IV Therapy",
    description: "Physician-curated IV blends administered in a calm suite.",
    href: "/services/iv-therapy",
    image: "/images/products/nad-iv.jpg",
  },
  {
    title: "Aesthetics & Skin Care",
    description: "Refinement-focused aesthetics with a natural ethos.",
    href: "/services/aesthetics-cosmetics",
    image: "/images/products/facial.jpg",
  },
  {
    title: "Hormone Therapy",
    description: "Hormone care coordinated with your broader wellness plan.",
    href: "/services",
    image: "/images/products/glp-1-gip-program.jpg",
  },
  {
    title: "Research Peptides",
    description: "Research-use peptides with clear labeling and documentation.",
    href: "/store?category=Peptides%20(Research%20Use%20Only)",
    image: "/images/products/ghk-cu.jpg",
  },
] as const;

export function ServicesPreview() {
  return (
    <section className="border-y border-line/80 bg-canvas py-16">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Services"
          title="What we offer"
          description="Explore our services"
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <article
              key={s.title}
              className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-white">
                <Image src={s.image} alt={s.title} fill loading="lazy" className="object-cover" sizes="360px" />
              </div>
              <div className="p-5">
                <p className="font-display text-xl text-ink">{s.title}</p>
                <p className="mt-2 text-sm text-muted">{s.description}</p>
                <Link href={s.href} className="mt-4 inline-flex text-sm font-semibold text-ink underline-offset-2 hover:underline">
                  Learn more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
