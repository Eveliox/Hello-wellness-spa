import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { getService, services, type ServiceSlug } from "@/content/services";
import { faqsByIds } from "@/content/faqs";
import { testimonials } from "@/content/testimonials";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { TrustChip } from "@/components/ui/trust-chip";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { TestimonialsSection } from "@/components/testimonials/testimonials-section";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug as ServiceSlug);
  if (!service) return {};
  return createMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
    image: service.heroImage,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug as ServiceSlug);
  if (!service) notFound();

  const ivAddOns = [
    {
      title: "NAD+",
      image: "/images/boosters/nad-plus.jpg",
      note: "Ask your clinician if it’s a fit for your goals.",
    },
    {
      title: "NAD+ (close up)",
      image: "/images/boosters/nad-plus-closeup.jpeg",
      note: "A closer look at one of our popular add-ons.",
    },
    {
      title: "Glutathione",
      image: "/images/boosters/gluta.png",
      note: "Discuss dosing and timing during intake.",
    },
    {
      title: "L‑Carnitine",
      image: "/images/boosters/l-carnitine.png",
      note: "Best selected with clinician guidance.",
    },
    {
      title: "Lipotropic",
      image: "/images/boosters/lipotropic.png",
      note: "We’ll confirm appropriateness before adding.",
    },
    {
      title: "IPA",
      image: "/images/boosters/ipa.png",
      note: "Available when clinically appropriate.",
    },
  ] as const;

  const peptideSpotlight = [
    {
      title: "GHK‑Cu",
      image: "/images/boosters/ghk.png",
      note: "Peptides are always discussed with screening and oversight.",
    },
  ] as const;

  const keyword =
    service.slug === "peptide-therapy"
      ? "peptide"
      : service.slug === "assisted-weight-loss"
        ? "weight"
        : service.slug === "aesthetics-cosmetics"
          ? "aesthetic"
          : "iv";

  const relatedTestimonials = testimonials.filter((t) =>
    t.service?.toLowerCase().includes(keyword),
  );
  const testimonialBlock = relatedTestimonials.length ? relatedTestimonials : testimonials.slice(0, 2);

  const showIvAddOns = service.slug === "iv-therapy" || service.slug === "build-your-own-iv";
  const showPeptides = service.slug === "peptide-therapy";

  return (
    <>
      <section className="border-b border-line/80 bg-surface">
        <Container className="grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{service.eyebrow}</p>
            <h1 className="font-display text-4xl text-balance text-ink sm:text-5xl">{service.title}</h1>
            <p className="text-base leading-relaxed text-muted">{service.summary}</p>
            <div className="flex flex-wrap gap-2">
              <TrustChip>Medical oversight</TrustChip>
              <TrustChip>SW Miami</TrustChip>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href={`tel:${site.phoneTel}`} size="lg">
                Call {site.phoneDisplay}
              </Button>
              <Button href={site.social.instagram} variant="secondary" size="lg">
                Instagram
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Ask a question
              </Button>
            </div>
            <p className="text-xs text-faint">{service.ctaNote}</p>
          </div>
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border border-line shadow-soft">
            <Image
              src={service.heroImage}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-ink">What you can expect</h2>
            <p className="mt-3 text-sm text-muted">{service.sessionNote}</p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              {service.benefits.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm">
            <h3 className="font-display text-2xl text-ink">Ideal for guests who want…</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {service.idealFor.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-1 text-ink" aria-hidden>
                    ✓
                  </span>
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl bg-accent-soft/50 p-4 text-sm text-muted">
              <p className="font-semibold text-ink">Need help choosing?</p>
              <p className="mt-2">
                Tell us your goals when you call or message—we will route you to the right provider and visit length.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {showIvAddOns ? (
        <section className="border-y border-line/80 bg-surface py-16">
          <Container>
            <h2 className="font-display text-3xl text-ink">Popular add-ons</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Choose what aligns with your goals—we’ll confirm what’s appropriate during intake and keep your blend
              transparent.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ivAddOns.map((item) => (
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
      ) : null}

      {showPeptides ? (
        <section className="border-y border-line/80 bg-surface py-16">
          <Container>
            <h2 className="font-display text-3xl text-ink">Peptide spotlight</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              We only recommend peptide care when it fits your labs, lifestyle, and clinical profile.
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
      ) : null}

      <section className="border-y border-line/80 bg-surface py-16">
        <Container>
          <h2 className="font-display text-3xl text-ink">Guests who chose this pathway</h2>
          <p className="mt-2 text-sm text-muted">Social proof stays close to conversion moments on purpose.</p>
          <div className="mt-8">
            <TestimonialsSection items={testimonialBlock} variant="grid" />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-3xl text-ink">Common questions</h2>
            <p className="mt-3 text-sm text-muted">
              Still deciding? These answers mirror what we share at the concierge desk.
            </p>
            <Button href="/faq" variant="secondary" className="mt-6" size="md">
              Full FAQ library
            </Button>
          </div>
          <FaqAccordion items={faqsByIds(service.faqIds)} />
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="rounded-[2rem] border border-line bg-[color-mix(in_oklab,var(--accent-soft)_70%,white)] p-8 text-center shadow-inner sm:p-10">
            <h2 className="font-display text-3xl text-ink">Ready for your {service.shortTitle.toLowerCase()} visit?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
              Secure a consultation or treatment block—our team confirms details within one business day.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={`tel:${site.phoneTel}`} variant="secondary" size="lg">
                Call {site.phoneDisplay}
              </Button>
              <Button href={site.social.instagram} size="lg">
                Message on Instagram
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
