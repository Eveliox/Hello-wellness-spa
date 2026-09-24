import type { Metadata } from "next";
import Link from "next/link";
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
    title: "IV therapy & wellness",
    description:
      "Hydration, recovery, and clinical peptide protocols. Same medical oversight, three ways to receive it.",
    slugs: ["iv-therapy", "build-your-own-iv", "peptide-therapy"],
  },
  {
    id: "weight-hormones",
    eyebrow: "Weight & Hormones",
    title: "Weight management & hormone care",
    description:
      "Physician-led weight management and hormone therapy backed by labs, follow-ups, and monthly check-ins.",
    slugs: ["assisted-weight-loss", "hormone-therapy"],
  },
  {
    id: "aesthetics",
    eyebrow: "Aesthetics",
    title: "Skin & aesthetics",
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
Find the care that fits your goals.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Explore our services below. Not sure where to start? A consultation can help you
            understand your options and the next step.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={site.bookingUrl} size="lg">
              Book a free consultation
            </Button>
            <Button href="/programs/packages" variant="secondary" size="lg">
              Packages &amp; pricing
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

      <section className="border-t border-line bg-surface py-12">
        <Container>
          <h2 className="font-display text-2xl text-ink">Galleri screening</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/75">
            Learn about multi-cancer early detection screening and discuss suitability with a provider.
          </p>
          <Link href="/services/galleri" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-ink underline underline-offset-4">Explore Galleri screening →</Link>
        </Container>
      </section>

      <section className="border-t border-line bg-surface-warm py-12">
        <Container>
          <h2 className="font-display text-2xl text-ink">Looking for ongoing care?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/75">
            Programs organize care around a goal. Memberships offer recurring benefits.
            Explore either when you’re ready, or use our quiz for a starting point.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm font-semibold text-ink">
            <Link className="inline-flex min-h-11 items-center underline underline-offset-4" href="/programs">Explore programs →</Link>
            <Link className="inline-flex min-h-11 items-center underline underline-offset-4" href="/memberships">View memberships →</Link>
            <Link className="inline-flex min-h-11 items-center underline underline-offset-4" href="/quiz">Help me choose →</Link>
          </div>
        </Container>
      </section>
    </>
  );
}
