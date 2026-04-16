import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { TrustChip } from "@/components/ui/trust-chip";

export function FinalCtaBanner() {
  return (
    <section className="pb-20 md:pb-16">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-[color-mix(in_oklab,var(--ink)_6%,white)] px-8 py-10 text-center shadow-soft sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.85),_transparent_60%)]" />
          <div className="relative mx-auto max-w-2xl space-y-4">
            <TrustChip>Ready when you are</TrustChip>
            <h2 className="font-display text-3xl text-balance text-ink sm:text-4xl">
              Call the studio. Keep the confidence.
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              Choose a pathway—weight, aesthetics, IV, peptides—and arrive to a team already briefed on your
              goals.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={`tel:${site.phoneTel}`} size="lg">
                Call {site.phoneDisplay}
              </Button>
              <Button href={site.social.instagram} variant="secondary" size="lg">
                Instagram
              </Button>
              <Button href="/services" variant="secondary" size="lg">
                Browse services
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
