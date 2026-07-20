import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { services, type ServiceContent, type ServiceSlug } from "@/content/services";
import { Container } from "@/components/ui/container";
import { ServiceCard } from "@/components/services/service-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = createMetadata({
  title: "Medical Spa Services in SW Miami",
  description: `Explore assisted weight loss, aesthetics, IV therapy, BYO IV, and peptides at ${site.name} in Miami.`,
  path: "/services",
});

type Category = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  slugs: ServiceSlug[];
};

const CATEGORIES: Category[] = [
  {
    id: "wellness",
    eyebrow: "Wellness · IV · Peptides",
    title: "Feel like yourself, on your schedule.",
    description:
      "Hydration, recovery, and clinical peptide protocols. Same medical oversight, three ways to receive it.",
    slugs: ["iv-therapy", "build-your-own-iv", "peptide-therapy"],
  },
  {
    id: "weight-hormones",
    eyebrow: "Weight & Hormones",
    title: "Programs, not prescriptions.",
    description:
      "Physician-led weight management and hormone therapy backed by labs, follow-ups, and monthly check-ins.",
    slugs: ["assisted-weight-loss", "hormone-therapy"],
  },
  {
    id: "aesthetics",
    eyebrow: "Aesthetics",
    title: "Refined, never overdone.",
    description:
      "Injectables and treatments guided by conservative technique. Consultations are always complimentary.",
    slugs: ["aesthetics-cosmetics"],
  },
];

function pickServices(slugs: ServiceSlug[]): ServiceContent[] {
  return slugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is ServiceContent => Boolean(s));
}

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-line/80 bg-surface py-14">
        <Container className="max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent-peach">
            <span className="h-px w-6 bg-accent-peach" aria-hidden />
            Services overview
          </p>
          <h1 className="mt-4 font-display text-4xl text-balance text-ink sm:text-5xl">
            Choose a pathway. We handle the{" "}
            <span className="font-script text-[1.3em] font-normal italic leading-none text-accent-peach">
              choreography
            </span>
            .
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Every service line shares the same promise: medical credibility, feminine calm, and copy
            you can understand without a dictionary.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`tel:${site.phoneTel}`} size="lg">
              Call {site.phoneDisplay}
            </Button>
            <Button href="/faq" variant="secondary" size="lg">
              Read FAQs
            </Button>
          </div>
        </Container>
      </section>

      {CATEGORIES.map((category, idx) => {
        const items = pickServices(category.slugs);
        if (items.length === 0) return null;
        const isDark = idx % 2 === 1;
        return (
          <section
            key={category.id}
            className={
              "py-16 " +
              (isDark ? "bg-canvas" : "border-b border-line/80 bg-surface")
            }
          >
            <Container>
              <div className="max-w-2xl">
                <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent-peach">
                  <span className="h-px w-6 bg-accent-peach" aria-hidden />
                  {category.eyebrow}
                </p>
                <h2 className="mt-4 font-display text-3xl text-balance text-ink sm:text-4xl">
                  {category.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  {category.description}
                </p>
              </div>
              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                {items.map((service) => (
                  <ServiceCard key={service.slug} service={service} />
                ))}
              </div>
            </Container>
          </section>
        );
      })}
    </>
  );
}
