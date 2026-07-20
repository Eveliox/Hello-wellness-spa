import type { Metadata } from "next";
import Image from "next/image";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { partnersContent } from "@/data/partners-content";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { JsonLd } from "@/components/json-ld";
import { faqPageJsonLd } from "@/lib/faq-schema";
import { BenefitCard } from "@/components/partners/benefit-card";
import { HowItWorksStep } from "@/components/partners/how-it-works-step";
import { CommissionDisplay } from "@/components/partners/commission-display";
import { HeadlineWithItalic } from "@/components/ui/headline-with-italic";
import { PartnerApplicationForm } from "@/components/partners/partner-application-form";

export const metadata: Metadata = createMetadata({
  title: "Partner with Hello You Wellness — Miami",
  description:
    "Refer clients, earn 15% of their first purchase. Hello You Wellness Partners is a referral program for South Florida trainers, gym owners, and studio operators. APRN-supervised care, monthly payouts, no cost to join.",
  path: "/partners",
});

export default function PartnersPage() {
  const c = partnersContent;

  const finalSecondaryHref = c.finalCta.secondaryCta.includes("{phone}")
    ? `tel:${site.phoneTel}`
    : undefined;
  const finalSecondaryLabel = c.finalCta.secondaryCta.replace("{phone}", site.phoneDisplay);

  return (
    <>
      <JsonLd data={faqPageJsonLd(c.faqs)} />

      {/* Hero */}
      <section className="border-b border-line/80 bg-surface py-16">
        <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
              <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
              {c.heroEyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl text-balance text-ink sm:text-5xl">
              <HeadlineWithItalic text={c.heroHeadline} />
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
              {c.heroSubhead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#apply" size="lg">
                {c.heroPrimaryCta}
              </Button>
              <Button href="#how-it-works" variant="secondary" size="lg">
                {c.heroSecondaryCta}
              </Button>
            </div>
          </div>

          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border border-line shadow-soft">
            <Image
              src="/partners-hero.jpg"
              alt="Trainer coaching a client through a workout — the kind of professional Hello You Wellness partners with"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 46vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="bg-canvas py-16">
        <Container>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {c.benefits.map((benefit) => (
              <BenefitCard key={benefit.title} benefit={benefit} />
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-line/80 bg-surface py-16">
        <Container className="max-w-5xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
            <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
            How it works
          </p>
          <h2 className="mt-4 font-display text-3xl text-balance text-ink sm:text-4xl">
            From application to first payout.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            {c.howItWorks.map((step) => (
              <HowItWorksStep key={step.step} step={step} />
            ))}
          </div>
        </Container>
      </section>

      {/* Commission */}
      <section className="bg-canvas py-16">
        <Container>
          <CommissionDisplay commission={c.commission} />
        </Container>
      </section>

      {/* Audience */}
      <section className="border-y border-line/80 bg-surface py-16">
        <Container className="max-w-4xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
            <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
            {c.audience.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl text-balance text-ink sm:text-4xl">
            {c.audience.headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">{c.audience.body}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {c.audience.goodFit.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ink">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-ink"
                  aria-hidden
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
                    <path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Apply */}
      <section id="apply" className="bg-canvas py-16">
        <Container className="max-w-2xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
            <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
            Apply to partner
          </p>
          <h2 className="mt-4 font-display text-3xl text-balance text-ink sm:text-4xl">
            Tell us about your business.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Applications reviewed within one business day. Approved partners get their code, dashboard
            access, and starter kit in the reply.
          </p>
          <div className="mt-8 rounded-[2rem] border border-line bg-surface p-6 shadow-sm sm:p-10">
            <PartnerApplicationForm />
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-y border-line/80 bg-surface py-16">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-3xl text-ink">Common questions</h2>
            <p className="mt-3 text-sm text-muted">
              Not seeing your question? Text or call {site.phoneDisplay} and we&apos;ll walk you
              through it.
            </p>
            <Button href={`tel:${site.phoneTel}`} variant="secondary" className="mt-6" size="md">
              Call {site.phoneDisplay}
            </Button>
          </div>
          <div>
            <FaqAccordion items={c.faqs} />
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="pb-20 pt-16">
        <Container>
          <div className="rounded-[2rem] border border-line bg-[#1a1a1a] p-8 text-center text-white shadow-inner sm:p-10">
            <h2 className="font-display text-3xl">{c.finalCta.headline}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/75">{c.finalCta.body}</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href="#apply"
                size="lg"
                className="bg-[#C0392B] text-white hover:bg-[#C0392B]/90"
              >
                {c.finalCta.primaryCta}
              </Button>
              {finalSecondaryHref ? (
                <Button
                  href={finalSecondaryHref}
                  variant="secondary"
                  size="lg"
                  className="border border-white/25 bg-white/5 text-white hover:bg-white/10"
                >
                  {finalSecondaryLabel}
                </Button>
              ) : null}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
