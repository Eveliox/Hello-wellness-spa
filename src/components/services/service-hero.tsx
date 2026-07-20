import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { TrustChip } from "@/components/ui/trust-chip";
import { HeadlineWithItalic } from "@/components/ui/headline-with-italic";

export type ServiceHeroCta = {
  label: string;
  href: string;
};

export type ServiceHeroProps = {
  /** Small uppercase eyebrow above the H1, e.g. "Hormone Therapy · SW Miami". */
  eyebrow: string;
  /** Main headline. Supports `{italic:phrase}` markers for the script accent. */
  title: string;
  /** One-sentence subhead below the title. */
  summary: string;
  heroImage: string;
  heroImageAlt: string;
  /** Optional trust chips row (e.g. "Licensed medical provider", "SW Miami"). */
  trustChips?: string[];
  primaryCta: ServiceHeroCta;
  secondaryCta?: ServiceHeroCta;
  /** Small text below the CTAs. */
  ctaNote?: string;
};

export function ServiceHero({
  eyebrow,
  title,
  summary,
  heroImage,
  heroImageAlt,
  trustChips,
  primaryCta,
  secondaryCta,
  ctaNote,
}: ServiceHeroProps) {
  return (
    <section className="border-b border-line/80 bg-surface">
      <Container className="grid gap-10 pt-16 pb-16 sm:pt-20 sm:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent-peach">
            <span className="h-px w-6 bg-accent-peach" aria-hidden />
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl text-balance text-ink sm:text-5xl">
            <HeadlineWithItalic text={title} />
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">{summary}</p>

          {trustChips && trustChips.length > 0 ? (
            <div className="mt-7 flex flex-wrap gap-2">
              {trustChips.map((chip) => (
                <TrustChip key={chip}>{chip}</TrustChip>
              ))}
            </div>
          ) : null}

          <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              href={primaryCta.href}
              size="md"
              className="w-full whitespace-nowrap bg-chrome-cta px-5 text-white hover:bg-chrome-cta/90 sm:w-auto"
            >
              {primaryCta.label}
            </Button>
            {secondaryCta ? (
              <Button
                href={secondaryCta.href}
                variant="ghost"
                size="md"
                className="w-full border border-line bg-transparent px-4 text-muted shadow-none hover:border-ink/20 hover:bg-ink/[0.03] sm:w-auto"
              >
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>

          {ctaNote ? <p className="mt-3 text-xs text-faint">{ctaNote}</p> : null}
        </div>

        <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border border-line shadow-soft">
          <Image
            src={heroImage}
            alt={heroImageAlt}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 46vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
        </div>
      </Container>
    </section>
  );
}
