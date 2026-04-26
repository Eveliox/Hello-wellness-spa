import Image from "next/image";
import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { bookingUrlForServiceSlug } from "@/lib/booking";
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
import { IVBuilder } from "@/components/services/iv-builder";
import { WeightLossContent } from "@/components/services/weight-loss-content";
import { AestheticsContent } from "@/components/services/aesthetics-content";
import { IvTherapyContent } from "@/components/services/iv-therapy-content";
import { IvAddOnsSection } from "@/components/services/iv-addons-section";
import { ByoIvContent } from "@/components/services/byo-iv-content";
import { PeptideContent } from "@/components/services/peptide-content";
import { GettingStartedSection } from "@/components/services/getting-started-section";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug as ServiceSlug);
  if (!service) return {};
  if (service.slug === "aesthetics-cosmetics") {
    return createMetadata({
      title: "Aesthetics & Cosmetics | Hello You Wellness Miami",
      description:
        "Botox, dermal fillers, and Morpheus8 RF microneedling in SW Miami—conservative technique, natural movement, and plans tailored to your anatomy and goals.",
      path: `/services/${service.slug}`,
      image: service.heroImage,
    });
  }
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

  const serviceBookingUrl = bookingUrlForServiceSlug(service.slug);

  const isPeptidesPage = service.slug === "peptide-therapy";
  const isWeightLossPage = service.slug === "assisted-weight-loss";
  const isAestheticsPage = service.slug === "aesthetics-cosmetics";
  const isIvTherapyPage = service.slug === "iv-therapy";
  const isByoIvPage = service.slug === "build-your-own-iv";

  const aestheticsSteps = [
    "Treatment plans tailored to bone structure and skin type",
    "Conservative technique with meticulous placement",
    "Photography-friendly lighting for honest before/after review",
    "Recovery guidance you can follow between visits",
  ] as const;

  const weightLossSteps = [
    { title: "Consultation", body: service.benefits[0] ?? "" },
    { title: "Plan + pacing", body: service.benefits[1] ?? "" },
    { title: "Lifestyle support", body: service.benefits[2] ?? "" },
    { title: "Follow-ups", body: service.benefits[3] ?? "" },
  ].filter((s) => s.body);

  const serviceJsonLd = isWeightLossPage
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
    : isAestheticsPage
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Aesthetics & cosmetics",
          provider: {
            "@type": "MedicalClinic",
            name: site.name,
            url: site.url,
            telephone: site.phoneDisplay,
          },
          areaServed: { "@type": "City", name: "Miami" },
          serviceType: "Aesthetics services",
          url: `${site.url}/services/aesthetics-cosmetics`,
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

  const aestheticsTestimonials: typeof testimonials = [
    testimonials.find((t) => t.name === "Camila R.") ?? {
      id: "aes-1",
      quote:
        "The space feels like a private members' lounge, not a clinic. My injector listened more than she talked—and the results look like me on a very good week.",
      name: "Camila R.",
      detail: "Kendall · Aesthetics guest",
      service: "Aesthetics",
    },
    {
      id: "aes-2",
      quote:
        "I was nervous about looking overdone. They started conservatively and built up gradually — exactly what I asked for. Three months later, people just say I look rested.",
      name: "Diana L.",
      detail: "Westchester · Botox & filler guest",
      service: "Injectables",
    },
    {
      id: "aes-3",
      quote:
        "The Morpheus8 session was more comfortable than I expected. My skin texture improved noticeably within a few weeks. I'm already booked for my next round.",
      name: "Sophia M.",
      detail: "Coral Gables · Morpheus8 guest",
      service: "Skin care",
    },
  ];

  const ivTherapyTestimonials: typeof testimonials = [
    testimonials.find((t) => t.name === "Elena S.") ?? {
      id: "iv-1",
      quote:
        "IVs after long flights used to take me days to recover from. Now I book the hydration blend, work quietly for an hour, and I'm back to baseline.",
      name: "Elena S.",
      detail: "Miami Beach · IV therapy",
      service: "IV therapy",
    },
    {
      id: "iv-2",
      quote:
        "I started with a Myers' Cocktail before a work trip and felt noticeably sharper. Now it's part of my monthly routine — the team remembers my blend.",
      name: "Marcus D.",
      detail: "Kendall · IV therapy guest",
      service: "IV therapy",
    },
    {
      id: "iv-3",
      quote:
        "The NAD+ drip was a game-changer for my energy levels. The lounge is comfortable, the nurse checked on me regularly, and I left feeling recharged.",
      name: "Adriana P.",
      detail: "Coral Gables · NAD+ guest",
      service: "NAD+ infusion",
    },
  ];

  const byoIvTestimonials: typeof testimonials = [
    testimonials.find((t) => t.name === "Elena S.") ?? {
      id: "byo-1",
      quote:
        "IVs after long flights used to take me days to recover from. Now I book the hydration blend, work quietly for an hour, and I'm back to baseline.",
      name: "Elena S.",
      detail: "Miami Beach · IV therapy",
      service: "IV therapy",
    },
    {
      id: "byo-2",
      quote:
        "I love that I can tweak my blend each time. Last month was all about immunity before a trip. This month it's recovery after a marathon. Same clinic, different formula.",
      name: "Ryan K.",
      detail: "Kendall · Build Your Own IV guest",
      service: "Custom IV",
    },
    {
      id: "byo-3",
      quote:
        "My wife and I book adjacent chairs and build our own blends. She goes heavy on the beauty add-ons, I load up on NAD+ and B-complex. It's become our monthly reset.",
      name: "Andre & Lisa M.",
      detail: "Coral Gables · Couples IV",
      service: "Couples IV",
    },
  ];

  return (
    <>
      {serviceJsonLd ? <JsonLd data={serviceJsonLd} /> : null}

      {/* ── Hero ── */}
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
                  isWeightLossPage ? "font-medium text-[#C0392B]" : "font-semibold text-muted",
                ].join(" ")}
              >
                {isWeightLossPage ? <span className="h-4 w-[2px] bg-[#C0392B]" aria-hidden /> : null}
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
                  dotClassName={isWeightLossPage ? "bg-[#C0392B]" : "bg-ink"}
                >
                  SW Miami
                </TrustChip>
              </div>

              <div className="mt-7">
                {isByoIvPage ? (
                  <>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Button
                        href="#iv-builder"
                        size="md"
                        className="w-full max-w-none whitespace-nowrap bg-[#1a1a1a] px-5 text-white hover:bg-[#1a1a1a]/90 sm:w-auto sm:max-w-[260px]"
                      >
                        Start Building Your IV
                      </Button>
                      <Button
                        href={serviceBookingUrl}
                        variant="ghost"
                        size="md"
                        className="w-full border border-line bg-transparent px-4 text-[#666] shadow-none hover:border-ink/20 hover:bg-black/[0.03] sm:w-auto"
                      >
                        Book a Consultation
                      </Button>
                    </div>
                    <a
                      className="mt-2 inline-block text-sm text-[#333] underline-offset-2 hover:underline"
                      href={`tel:${site.phoneTel}`}
                    >
                      Call {site.phoneDisplay}
                    </a>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      {isWeightLossPage || isAestheticsPage || isIvTherapyPage ? (
                        <Button
                          href={serviceBookingUrl}
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

                    {isWeightLossPage || isAestheticsPage || isIvTherapyPage ? (
                      <>
                        <div className="mt-2 flex items-center gap-2 text-sm font-medium text-ink">
                          <span className={isIvTherapyPage ? "text-[#27ae60]" : "text-[#27ae60]"} aria-hidden>
                            {isIvTherapyPage ? "ℹ" : "●"}
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
                  </>
                )}
              </div>

              {isByoIvPage ? (
                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-ink">
                  <span aria-hidden className="text-ink/80">
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                      <path
                        d="M7 3h10a2 2 0 0 1 2 2v16l-7-4-7 4V5a2 2 0 0 1 2-2Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{service.ctaNote}</span>
                </div>
              ) : null}
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
                    ? "Hello You Wellness Center assisted weight loss"
                    : isAestheticsPage
                      ? "Hello You Wellness Center aesthetics & cosmetics hero imagery"
                      : ""
                }
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
            </div>
          </Container>
        </div>
      </section>

      {/* ── Service-specific sections ── */}
      {isByoIvPage ? (
        <Suspense fallback={null}>
          <IVBuilder />
        </Suspense>
      ) : null}
      {isIvTherapyPage ? <IvTherapyContent bookingUrl={serviceBookingUrl} testimonialItems={ivTherapyTestimonials} /> : null}
      {isAestheticsPage ? <AestheticsContent service={service} bookingUrl={serviceBookingUrl} testimonialItems={aestheticsTestimonials} /> : null}

      {/* ── What you can expect ── */}
      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <div className="relative">
              <h2 className="font-display text-3xl text-ink">
                {isPeptidesPage ? "What's included" : "What you can expect"}
              </h2>
              <p className="mt-3 text-sm text-muted">{service.sessionNote}</p>

              {isWeightLossPage ? (
                <div className="mt-8 space-y-4">
                  {weightLossSteps.map((step, idx) => (
                    <div key={step.title} className="relative rounded-3xl border border-line bg-surface p-5 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 text-sm font-semibold text-[#C0392B]">
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
              ) : isAestheticsPage ? (
                <div className="mt-8 space-y-4">
                  {aestheticsSteps.map((title, idx) => (
                    <div key={title} className="rounded-3xl border border-line bg-surface p-5 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 text-2xl font-bold text-[#C0392B]">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink">{title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-muted">{service.benefits[idx] ?? ""}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : isIvTherapyPage ? (
                <div className="mt-8 space-y-4">
                  {service.benefits.map((b, idx) => (
                    <div key={b} className="rounded-3xl border border-line bg-surface p-5 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 text-2xl font-bold text-[#C0392B]">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink">{b}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : isByoIvPage ? (
                <div className="mt-6">
                  <span className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted">
                    Allow an extra 10 minutes on your first custom build
                  </span>
                  <div className="mt-6 space-y-4">
                    {service.benefits.map((b, idx) => (
                      <div key={b} className="rounded-3xl border border-line bg-surface p-5 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="shrink-0 text-2xl font-bold text-[#C0392B]">
                            {String(idx + 1).padStart(2, "0")}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-ink">{b}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
              ) : isAestheticsPage ? (
                <div className="pointer-events-none absolute -right-10 top-10 hidden w-[15rem] rotate-2 lg:block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft">
                    <Image
                      src="/images/about/background.webp"
                      alt="Hello You Wellness Center treatment room ambiance"
                      fill
                      className="object-cover"
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
                isWeightLossPage || isAestheticsPage || isIvTherapyPage
                  ? "bg-[#faf8f6] border-l-[3px] [border-left-color:#C0392B]"
                  : "bg-surface",
                isAestheticsPage || isIvTherapyPage ? "rounded-l-none" : "",
              ].join(" ")}
            >
              <h3 className="font-display text-2xl text-ink">{isPeptidesPage ? "Designed for" : "Ideal for guests who want…"}</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                {service.idealFor.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-1 text-ink" aria-hidden>✓</span>
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-2xl bg-accent-soft/50 p-4 text-sm text-muted">
                <p className="font-semibold text-ink">Need help choosing?</p>
                <p className="mt-2">
                  Tell us your goals when you call or message—we will route you to the right provider and visit length.
                </p>
                {isAestheticsPage || isIvTherapyPage ? (
                  <div className="mt-4">
                    <a className="inline-flex text-sm font-semibold text-ink underline-offset-4 hover:underline" href="/quiz">
                      Take the 2-min quiz <span aria-hidden>→</span>
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Weight loss gallery + pricing ── */}
      {isWeightLossPage ? <WeightLossContent testimonialItems={weightLossTestimonials} /> : null}

      {/* ── IV add-ons ── */}
      {showIvAddOns ? <IvAddOnsSection isByoIvPage={isByoIvPage} serviceSlug={service.slug} /> : null}

      {/* ── Peptide catalog ── */}
      {showPeptides ? <PeptideContent /> : null}

      {/* ── BYO IV testimonials ── */}
      {isByoIvPage ? <ByoIvContent testimonialItems={byoIvTestimonials} /> : null}

      {/* ── Generic testimonials (non-specific service types) ── */}
      {!isWeightLossPage && !isAestheticsPage && !isIvTherapyPage && !isByoIvPage && !isPeptidesPage ? (
        <section className="border-y border-line/80 bg-surface py-16">
          <Container>
            <h2 className="font-display text-3xl text-ink">Guests who chose this pathway</h2>
            <p className="mt-2 text-sm text-muted">What our guests are saying</p>
            <div className="mt-8">
              <TestimonialsSection items={testimonialBlock} variant="grid" />
            </div>
          </Container>
        </section>
      ) : null}

      {/* ── Getting Started ── */}
      <GettingStartedSection steps={service.gettingStartedSteps} cta={service.gettingStartedCta} />

      {/* ── FAQ ── */}
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

      {/* ── CTA ── */}
      <section className="pb-20">
        <Container>
          <div
            className={[
              "rounded-[2rem] border border-line p-8 text-center shadow-inner sm:p-10",
              isWeightLossPage || isAestheticsPage || isIvTherapyPage || isByoIvPage
                ? "bg-[#1a1a1a] text-white"
                : "bg-[color-mix(in_oklab,var(--accent-soft)_70%,white)]",
            ].join(" ")}
          >
            <h2
              className={[
                "font-display text-3xl",
                isWeightLossPage || isAestheticsPage || isIvTherapyPage || isByoIvPage ? "text-white" : "text-ink",
              ].join(" ")}
            >
              {isPeptidesPage
                ? "Questions about research-only peptides?"
                : isByoIvPage
                  ? "Ready to build your blend?"
                  : `Ready for your ${service.shortTitle.toLowerCase()} visit?`}
            </h2>
            <p
              className={[
                "mx-auto mt-3 max-w-xl text-sm",
                isWeightLossPage || isAestheticsPage || isIvTherapyPage || isByoIvPage ? "text-white/75" : "text-muted",
              ].join(" ")}
            >
              {isPeptidesPage
                ? "Message us for documentation questions, availability, or store setup details."
                : isWeightLossPage
                  ? "No commitment required. Our team responds within one business day."
                  : isAestheticsPage
                    ? "No pressure. Consultations are complimentary and we'll never recommend more than you need."
                    : isIvTherapyPage
                      ? "Walk-ins welcome when availability allows. Same-week appointments are common."
                      : isByoIvPage
                        ? "First-time builders get a complimentary nutrient consultation."
                        : "Secure a consultation or treatment block—our team confirms details within one business day."}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {isWeightLossPage ? (
                <>
                  <Button href={serviceBookingUrl} size="lg" className="bg-[#C0392B] text-white hover:bg-[#C0392B]/90">
                    Book a Free Consultation
                  </Button>
                  <a className="text-sm font-medium text-white/85 underline-offset-2 hover:underline" href={`tel:${site.phoneTel}`}>
                    Call {site.phoneDisplay}
                  </a>
                </>
              ) : isAestheticsPage ? (
                <>
                  <Button href={serviceBookingUrl} size="lg" className="bg-[#C0392B] text-white hover:bg-[#C0392B]/90">
                    Book a Free Consultation
                  </Button>
                  <Button
                    href={`tel:${site.phoneTel}`}
                    variant="secondary"
                    size="lg"
                    className="border border-white/25 bg-white/5 text-white hover:bg-white/10"
                  >
                    Call {site.phoneDisplay}
                  </Button>
                </>
              ) : isIvTherapyPage ? (
                <>
                  <Button href={serviceBookingUrl} size="lg" className="bg-[#C0392B] text-white hover:bg-[#C0392B]/90">
                    Book Your IV Session
                  </Button>
                  <Button
                    href={`tel:${site.phoneTel}`}
                    variant="secondary"
                    size="lg"
                    className="border border-white/25 bg-white/5 text-white hover:bg-white/10"
                  >
                    Call {site.phoneDisplay}
                  </Button>
                </>
              ) : isByoIvPage ? (
                <>
                  <Button href={serviceBookingUrl} size="lg" className="bg-[#C0392B] text-white hover:bg-[#C0392B]/90">
                    Book Your Custom IV
                  </Button>
                  <Button
                    href={`tel:${site.phoneTel}`}
                    variant="secondary"
                    size="lg"
                    className="border border-white/25 bg-white/5 text-white hover:bg-white/10"
                  >
                    Call {site.phoneDisplay}
                  </Button>
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

      {/* ── Weight loss disclaimer ── */}
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
