import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HeadlineWithItalic } from "@/components/ui/headline-with-italic";
import { Container } from "@/components/ui/container";
import { ProgramAtAGlance } from "@/components/programs/program-at-a-glance";
import type { ProgramAtAGlance as ProgramAtAGlanceData } from "@/content/programs";

export type ProgramHeroCta = { label: string; href: string };

export type ProgramHeroProps = {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  honestFraming?: string;
  heroImage: string;
  heroImageAlt: string;
  heroCaption?: string;
  atAGlance?: ProgramAtAGlanceData;
  trustChips?: string[];
  primaryCta: ProgramHeroCta;
  secondaryCta?: ProgramHeroCta;
  ctaNote?: string;
  locale?: "en" | "es";
};

/**
 * Editorial asymmetric hero for /programs and /programas detail pages.
 *
 * Deliberately distinct from `<ServiceHero>` (peach split hero) and from
 * the earlier dark full-bleed program hero: light bg, right-side portrait
 * (3:4) with caption, data-first "at a glance" strip, honest-framing
 * italic line. Reads like a magazine feature open, not a landing hero.
 *
 * The hero image element carries `viewTransitionName: 'program-hero'` so
 * navigating from a /programs index card morphs the same image into place
 * on browsers that support the View Transitions API.
 */
export function ProgramHero({
  slug,
  eyebrow,
  title,
  summary,
  honestFraming,
  heroImage,
  heroImageAlt,
  heroCaption,
  atAGlance,
  trustChips,
  primaryCta,
  secondaryCta,
  ctaNote,
  locale = "en",
}: ProgramHeroProps) {
  const viewTransitionName = `program-hero-${slug}`;

  return (
    <section className="bg-surface pt-14 pb-16 sm:pt-20 sm:pb-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Left column — text + at-a-glance */}
          <div className="program-hero-entry">
            <p className="inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent-clinical">
              <span className="h-px w-8 bg-accent-clinical" aria-hidden />
              {eyebrow}
            </p>
            <h1 className="mt-6 font-display text-[3rem] leading-[1.02] text-balance text-ink sm:text-6xl lg:text-[4.25rem]">
              <HeadlineWithItalic text={title} />
            </h1>
            <div className="mt-6 h-px w-16 bg-accent-clinical" aria-hidden />
            <p className="mt-6 max-w-xl text-lg leading-[1.55] text-ink/78 text-pretty sm:text-xl">
              {summary}
            </p>

            {honestFraming ? (
              <p className="mt-6 max-w-xl border-l-2 border-accent-clinical/60 pl-5 font-display text-base italic leading-relaxed text-muted text-pretty">
                {honestFraming}
              </p>
            ) : null}

            {atAGlance ? (
              <div className="mt-10">
                <ProgramAtAGlance data={atAGlance} locale={locale} />
              </div>
            ) : null}

            {trustChips && trustChips.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {trustChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                href={primaryCta.href}
                size="lg"
                className="whitespace-nowrap bg-accent-clinical text-white hover:bg-[color-mix(in_oklab,var(--accent-clinical)_88%,white)]"
              >
                {primaryCta.label}
              </Button>
              {secondaryCta ? (
                <Button
                  href={secondaryCta.href}
                  size="lg"
                  className="whitespace-nowrap border border-line bg-transparent text-ink hover:bg-accent-soft"
                >
                  {secondaryCta.label}
                </Button>
              ) : null}
            </div>

            {ctaNote ? <p className="mt-4 text-xs text-faint">{ctaNote}</p> : null}
          </div>

          {/* Right column — 3:4 portrait, warm grade, inset caption */}
          <div className="program-hero-entry program-hero-entry-delayed">
            <figure className="relative">
              <div
                className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-canvas shadow-soft"
                style={{ viewTransitionName }}
              >
                <Image
                  src={heroImage}
                  alt={heroImageAlt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  style={{
                    filter: "contrast(1.02) saturate(0.94) brightness(1.02)",
                  }}
                />
              </div>
              {heroCaption ? (
                <figcaption className="mt-4 flex items-center gap-3 pl-6 font-display text-sm italic text-faint">
                  <span className="h-px w-6 bg-accent-clinical" aria-hidden />
                  {heroCaption}
                </figcaption>
              ) : null}
            </figure>
          </div>
        </div>
      </Container>
    </section>
  );
}
