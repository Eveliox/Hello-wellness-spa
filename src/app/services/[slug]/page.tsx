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
import { Reveal } from "@/components/ui/reveal";
import { JsonLd } from "@/components/json-ld";

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

  const isPeptidesPage = service.slug === "peptide-therapy";
  const isWeightLossPage = service.slug === "assisted-weight-loss";

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

  const weightLossGallery = [
    {
      title: "Program overview",
      image: "/images/assisted-weight-loss/weightloss.webp",
      note: "A calm, structured pathway with clear next steps.",
      href: "#program-options",
      startingAt: "$145",
    },
    {
      title: "Medication options",
      image: "/images/assisted-weight-loss/glp-1.webp",
      note: "Discussed with your provider and guided by your history and goals.",
      href: "#program-options",
      startingAt: "$199",
    },
    {
      title: "GLP collection",
      image: "/images/assisted-weight-loss/glp.webp",
      note: "Every plan is individualized—your care stays legible and documented.",
      href: "#program-options",
      startingAt: "$299",
    },
  ] as const;

  const weightLossSteps = [
    { title: "Consultation", body: service.benefits[0] ?? "" },
    { title: "Plan + pacing", body: service.benefits[1] ?? "" },
    { title: "Lifestyle support", body: service.benefits[2] ?? "" },
    { title: "Follow-ups", body: service.benefits[3] ?? "" },
  ].filter((s) => s.body);

  const weightLossPricing = [
    { name: "GLP-1 Program", initial: "$280", sale: "$199" },
    { name: "GLP-1/GIP Program", initial: "$420", sale: "$299" },
    { name: "4 Weeks Personalized Program", initial: "$390", sale: "$145" },
  ] as const;

  const serviceJsonLd =
    isWeightLossPage
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Assisted weight loss",
          provider: {
            "@type": "MedicalClinic",
            name: site.name,
            url: site.url,
            telephone: site.phoneDisplay,
          },
          areaServed: { "@type": "City", name: "Miami" },
          serviceType: "Medical weight management",
          url: `${site.url}/services/assisted-weight-loss`,
        }
      : null;

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

  const weightLossTestimonials = isWeightLossPage
    ? [
        ...testimonialBlock.filter((t) => (t.service ?? "").toLowerCase().includes("weight")).slice(0, 1),
        {
          id: "wl-1",
          quote:
            "The team made me feel comfortable from day one. The program is straightforward and the results speak for themselves.",
          name: "Maria L.",
          detail: "Kendall · Medical weight loss",
          service: "Weight loss",
        },
        {
          id: "wl-2",
          quote:
            "I appreciated the privacy and the medical supervision. This isn't a fad diet — it's a real program with real support.",
          name: "Carlos R.",
          detail: "Coral Gables · GLP-1 program",
          service: "Weight loss",
        },
      ].slice(0, 3)
    : [];

  return (
    <>
      {serviceJsonLd ? <JsonLd data={serviceJsonLd} /> : null}
      <section className="border-b border-line/80 bg-surface">
        <div className={isWeightLossPage ? "relative overflow-hidden" : undefined}>
          {isWeightLossPage ? (
            <Image
              src="/images/assisted-weight-loss/glp.webp"
              alt="Hello You Wellness Center branded GLP program vials"
              fill
              priority
              className="object-cover opacity-[0.22]"
              sizes="100vw"
            />
          ) : null}
          {isWeightLossPage ? (
            <div
              className="absolute inset-0"
              aria-hidden
              style={{
                background:
                  "radial-gradient(900px 520px at 92% 6%, rgba(192,57,43,0.04) 0%, rgba(192,57,43,0.0) 65%)",
              }}
            />
          ) : null}
          {isWeightLossPage ? (
            <div
              className="absolute inset-0"
              aria-hidden
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 38%, rgba(255,255,255,0.0) 72%)",
              }}
            />
          ) : null}
          <Container className="relative grid max-w-[1200px] gap-10 pt-20 pb-[100px] lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p
                className={[
                  "inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em]",
                  isWeightLossPage ? "font-medium text-[color:#C0392B]" : "font-semibold text-muted",
                ].join(" ")}
              >
                {isWeightLossPage ? <span className="h-4 w-[2px] bg-[color:#C0392B]" aria-hidden /> : null}
                {service.eyebrow}
              </p>

              <h1 className="mt-3 mb-6 font-display text-4xl text-balance text-ink sm:text-5xl">{service.title}</h1>

              <p className={isWeightLossPage ? "text-base leading-[1.7] text-[#555]" : "text-base leading-relaxed text-muted"}>
                {service.summary}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {isPeptidesPage ? (
                  <TrustChip className="bg-[#f5f4f2] px-4 py-2 text-xs border-line/90" dotClassName="bg-ink">
                    Research use only
                  </TrustChip>
                ) : (
                  <TrustChip
                    className="bg-[#f5f4f2] px-4 py-2 text-xs border-line/90"
                    dotClassName={isWeightLossPage ? "bg-[#27ae60]" : "bg-ink"}
                  >
                    Medical oversight
                  </TrustChip>
                )}
                <TrustChip
                  className="bg-[#f5f4f2] px-4 py-2 text-xs border-line/90"
                  dotClassName={isWeightLossPage ? "bg-[color:#C0392B]" : "bg-ink"}
                >
                  SW Miami
                </TrustChip>
              </div>

              <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center">
                {isWeightLossPage ? (
                  <Button
                    href={site.bookingUrl}
                    size="md"
                    className="w-full max-w-none whitespace-nowrap bg-[#1a1a1a] px-5 text-white hover:bg-[#1a1a1a]/90 sm:w-auto sm:max-w-[260px]"
                  >
                    Book a Free Consultation
                  </Button>
                ) : (
                  <Button href={`tel:${site.phoneTel}`} size="lg">
                    Call {site.phoneDisplay}
                  </Button>
                )}

                <Button
                  href={site.social.instagram}
                  variant="ghost"
                  size="md"
                  className="w-full border border-line bg-transparent px-4 text-[#666] shadow-none hover:border-ink/20 hover:bg-black/[0.03] sm:w-auto"
                >
                  Instagram
                </Button>
                <Button
                  href="/contact"
                  variant="ghost"
                  size="md"
                  className="w-full border border-line bg-transparent px-4 text-[#666] shadow-none hover:border-ink/20 hover:bg-black/[0.03] sm:w-auto"
                >
                  Ask a question
                </Button>
              </div>

              {isWeightLossPage ? (
                <>
                  <div className="mt-2 flex items-center gap-2 text-sm font-medium text-ink">
                    <span className="text-[color:#27ae60]" aria-hidden>
                      ●
                    </span>
                    <span>{service.ctaNote}</span>
                  </div>
                  <a
                    className="mt-2 inline-block text-sm text-[#333] underline-offset-2 hover:underline"
                    href={`tel:${site.phoneTel}`}
                  >
                    Call {site.phoneDisplay}
                  </a>
                </>
              ) : (
                <p className="mt-3 text-xs text-faint">{service.ctaNote}</p>
              )}
            </div>

            <div
              className={[
                "relative aspect-[5/4] overflow-hidden",
                isWeightLossPage
                  ? "rounded-2xl border border-[#e5e5e5] bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] rotate-[1.5deg]"
                  : "rounded-[2rem] border border-line shadow-soft",
              ].join(" ")}
            >
            <Image
              src={service.heroImage}
              alt={
                isWeightLossPage
                  ? "Hello You Wellness Center GLP program imagery"
                  : ""
              }
              fill
              priority
              className={isWeightLossPage ? "bg-white object-contain p-10" : "object-cover"}
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
            {isWeightLossPage ? null : (
              <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
            )}
            </div>
          </Container>
        </div>
      </section>

      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <div className="relative">
              <h2 className="font-display text-3xl text-ink">
                {isPeptidesPage ? "What’s included" : isWeightLossPage ? "What you can expect" : "What you can expect"}
              </h2>
              <p className="mt-3 text-sm text-muted">{service.sessionNote}</p>

              {isWeightLossPage ? (
                <div className="mt-8 space-y-4">
                  {weightLossSteps.map((step, idx) => (
                    <div
                      key={step.title}
                      className="relative rounded-3xl border border-line bg-surface p-5 shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 text-sm font-semibold" style={{ color: "#C0392B" }}>
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <p className="font-ui text-sm font-semibold text-ink">{step.title}</p>
                          <p className="mt-1 text-sm text-muted">{step.body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : isPeptidesPage ? null : (
                <ul className="mt-6 space-y-3 text-sm text-muted">
                  {service.benefits.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {isWeightLossPage ? (
                <div className="pointer-events-none absolute -right-10 top-10 hidden w-[15rem] rotate-6 lg:block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft">
                    <Image
                      src="/images/assisted-weight-loss/glp-1.webp"
                      alt="Single branded GLP-1/GIP vial"
                      fill
                      className="object-contain p-6"
                      sizes="240px"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </Reveal>

          <Reveal delayMs={80}>
            <div
              className={[
                "rounded-[var(--radius-card)] border border-line p-6 shadow-sm",
                isWeightLossPage ? "bg-[color:#faf8f6] border-l-[3px]" : "bg-surface",
              ].join(" ")}
              style={isWeightLossPage ? { borderLeftColor: "#C0392B" } : undefined}
            >
              <h3 className="font-display text-2xl text-ink">{isPeptidesPage ? "Designed for" : "Ideal for guests who want…"}</h3>
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
          </Reveal>
        </Container>
      </section>

      {isWeightLossPage ? (
        <section className="border-y border-line/80 bg-surface py-16">
          <Container>
            <h2 className="font-display text-3xl text-ink">A program designed to feel clear</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              High-touch support, straightforward language, and a plan you can follow—without the noise.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {weightLossGallery.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="group block overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
                >
                  <div className="relative aspect-[4/3] bg-white">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-6"
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl text-ink">{item.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-ink/85">Starting at {item.startingAt}</p>
                    <p className="mt-2 text-sm text-muted">{item.note}</p>
                  </div>
                </a>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {isWeightLossPage ? (
        <section id="program-options" className="py-16 scroll-mt-24">
          <Container>
            <Reveal>
              <h2 className="font-display text-3xl text-ink">Program options</h2>
              <p className="mt-2 text-sm text-muted">Transparent pricing with no hidden fees.</p>
            </Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {weightLossPricing.map((p, i) => (
                <Reveal key={p.name} delayMs={60 + i * 60}>
                  <div className="flex h-full flex-col rounded-[var(--radius-card)] bg-[#1a1a1a] p-6 text-white shadow-[0_20px_55px_rgba(0,0,0,0.25)]">
                    <p className="font-display text-xl">{p.name}</p>
                    <div className="mt-4 flex items-baseline gap-3">
                      <p className="text-sm text-white/55 line-through">{p.initial}</p>
                      <p className="text-3xl font-semibold" style={{ color: "#C0392B" }}>
                        {p.sale}
                      </p>
                    </div>
                    <p className="mt-3 text-sm text-white/70">
                      Includes an initial visit and a personalized plan with clear next steps.
                    </p>
                    <Button href={site.bookingUrl} size="md" className="mt-6 w-full bg-white text-ink hover:bg-white/90">
                      Get Started
                    </Button>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

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
            <div className="sticky top-0 z-40 -mx-4 border-b border-line bg-surface/95 px-4 py-4 backdrop-blur sm:-mx-0 sm:rounded-2xl sm:border sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">Research-use notice</p>
              <p className="mt-2 text-sm text-muted">
                All peptide products sold by Hello You Wellness Center are intended strictly for in-vitro research and laboratory use only. These products are not intended for human or animal consumption, and are not drugs, foods, or cosmetics. They are not to be used for diagnostic, therapeutic, or any form of clinical application. By purchasing from this store, you acknowledge and agree that these products will be used exclusively for legitimate research purposes.
              </p>
            </div>
            <h2 className="mt-10 font-display text-3xl text-ink">Peptide catalog preview</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Example items shown for merchandising and layout only. Product availability, documentation, and checkout flow are configured separately.
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

      {isWeightLossPage ? (
        <>
          <section className="border-y border-line/80 bg-surface py-16">
            <Container>
              <h2 className="font-display text-3xl text-ink">What our guests are saying</h2>
              <div className="mt-8">
                <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:snap-none md:overflow-visible md:px-0 md:pb-0 md:grid-cols-3">
                  {weightLossTestimonials.map((t) => (
                    <figure
                      key={t.id}
                      className="w-[min(92vw,26rem)] shrink-0 snap-start rounded-3xl border border-line bg-surface p-6 shadow-sm md:w-auto"
                    >
                      <div className="mb-3 flex gap-1" aria-label="5 star rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="text-[color:#C0392B]" aria-hidden>
                            ★
                          </span>
                        ))}
                      </div>
                      <blockquote className="text-sm leading-relaxed text-muted">“{t.quote}”</blockquote>
                      <figcaption className="mt-4 text-sm font-semibold text-ink">{t.name}</figcaption>
                      <p className="text-xs text-faint">{t.detail}</p>
                    </figure>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        </>
      ) : isPeptidesPage ? null : (
        <section className="border-y border-line/80 bg-surface py-16">
          <Container>
            <h2 className="font-display text-3xl text-ink">Guests who chose this pathway</h2>
            <p className="mt-2 text-sm text-muted">What our guests are saying</p>
            <div className="mt-8">
              <TestimonialsSection items={testimonialBlock} variant="grid" />
            </div>
          </Container>
        </section>
      )}

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
          <div
            className={[
              "rounded-[2rem] border border-line p-8 text-center shadow-inner sm:p-10",
              isWeightLossPage ? "bg-[#1a1a1a] text-white" : "bg-[color-mix(in_oklab,var(--accent-soft)_70%,white)]",
            ].join(" ")}
          >
            <h2 className={["font-display text-3xl", isWeightLossPage ? "text-white" : "text-ink"].join(" ")}>
              {isPeptidesPage ? "Questions about research-only peptides?" : `Ready for your ${service.shortTitle.toLowerCase()} visit?`}
            </h2>
            <p
              className={[
                "mx-auto mt-3 max-w-xl text-sm",
                isWeightLossPage ? "text-white/75" : "text-muted",
              ].join(" ")}
            >
              {isPeptidesPage
                ? "Message us for documentation questions, availability, or store setup details."
                : isWeightLossPage
                  ? "No commitment required. Our team responds within one business day."
                  : "Secure a consultation or treatment block—our team confirms details within one business day."}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {isWeightLossPage ? (
                <>
                  <Button href={site.bookingUrl} size="lg" className="bg-[color:#C0392B] text-white hover:bg-[#C0392B]/90">
                    Book a Free Consultation
                  </Button>
                  <a className="text-sm font-medium text-white/85 underline-offset-2 hover:underline" href={`tel:${site.phoneTel}`}>
                    Call {site.phoneDisplay}
                  </a>
                </>
              ) : (
                <>
                  <Button href={`tel:${site.phoneTel}`} variant="secondary" size="lg">
                    Call {site.phoneDisplay}
                  </Button>
                  <Button href={site.social.instagram} size="lg">
                    Message on Instagram
                  </Button>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>

      {isWeightLossPage ? (
        <section className="pb-10">
          <Container className="max-w-3xl">
            <p className="text-xs leading-relaxed text-faint">
              Individual results may vary. GLP-1 receptor agonist medications are FDA-approved and prescribed by
              licensed medical professionals. This program is not a substitute for a healthy diet and regular exercise.
              Consult with your provider to determine if this program is right for you.
            </p>
          </Container>
        </section>
      ) : null}
    </>
  );
}
