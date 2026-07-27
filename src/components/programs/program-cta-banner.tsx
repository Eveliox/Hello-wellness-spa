import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ClinicianSignature } from "@/components/programs/clinician-signature";

export type ProgramCTACtaProp = { label: string; href: string };

export type ProgramCTABannerProps = {
  heading: string;
  body: string;
  primaryCta: ProgramCTACtaProp;
  secondaryCta?: ProgramCTACtaProp;
  locale?: "en" | "es";
  /** Set false to hide the clinician signature (e.g. if placeholder isn't yet real). Defaults true. */
  showSignature?: boolean;
};

/**
 * Signed editorial final CTA. Warm ivory slab, blue accent rule up the
 * left, primary CTA in blue. If clinician placeholder in
 * `src/content/clinicians.ts` has been replaced with real data, the
 * signature card renders below the CTAs — the trust close.
 */
export function ProgramCTABanner({
  heading,
  body,
  primaryCta,
  secondaryCta,
  locale = "en",
  showSignature = true,
}: ProgramCTABannerProps) {
  return (
    <section className="bg-program-paper py-24 text-program-paper-ink">
      <Container className="max-w-4xl">
        <div className="border-l-2 border-accent-clinical pl-8 sm:pl-12">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-accent-clinical">
            {locale === "es" ? "Comienza tu programa" : "Start your program"}
          </p>
          <h2 className="mt-3 font-display text-4xl text-balance sm:text-5xl">{heading}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-program-paper-ink/78 text-pretty">
            {body}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              href={primaryCta.href}
              size="lg"
              className="bg-accent-clinical text-white hover:bg-[color-mix(in_oklab,var(--accent-clinical)_88%,white)]"
            >
              {primaryCta.label}
            </Button>
            {secondaryCta ? (
              <Button
                href={secondaryCta.href}
                size="lg"
                className="border border-program-paper-ink/20 bg-transparent text-program-paper-ink hover:bg-program-paper-ink/[0.05]"
              >
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
        </div>

        {showSignature ? (
          <div className="mt-12">
            <ClinicianSignature locale={locale} variant="light" />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
