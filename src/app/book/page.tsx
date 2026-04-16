import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { TrustChip } from "@/components/ui/trust-chip";

export const metadata: Metadata = createMetadata({
  title: "Call or message",
  description: `Reach ${site.name} in Miami by phone or Instagram.`,
  path: "/book",
});

const steps = [
  "Call the studio or send a DM on Instagram with your goal and a preferred day/time.",
  "We’ll reply with next steps, pricing context, and what to bring (if anything).",
  "Arrive with a clear plan—screening and suitability are confirmed before any medical service.",
];

export default function BookPage() {
  return (
    <>
      <section className="border-b border-line/80 bg-surface py-14">
        <Container className="max-w-3xl">
          <TrustChip>Reach us</TrustChip>
          <h1 className="mt-4 font-display text-4xl text-balance text-ink sm:text-5xl">
            Call or message us—we’ll take it from there.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            We’re keeping it simple: phone and socials. Share your goal and we’ll guide you to the right service
            and timing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`tel:${site.phoneTel}`} size="lg">
              Call {site.phoneDisplay}
            </Button>
            <Button href={site.social.instagram} variant="secondary" size="lg">
              Message on Instagram
            </Button>
            <Button href="/contact" variant="ghost" size="lg">
              Message us
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4 text-sm text-muted">
            <h2 className="font-display text-3xl text-ink">What happens next</h2>
            <ol className="list-decimal space-y-3 pl-5">
              {steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Quick links</p>
            <h3 className="mt-3 font-display text-2xl text-ink">Choose how you want to reach us</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button href={`tel:${site.phoneTel}`} size="lg" className="w-full">
                Call {site.phoneDisplay}
              </Button>
              <Button href={site.social.instagram} variant="secondary" size="lg" className="w-full">
                Instagram DMs
              </Button>
              <Button href="/contact" variant="secondary" size="lg" className="w-full sm:col-span-2">
                Contact form
              </Button>
            </div>
            <p className="mt-6 text-xs text-faint">
              Medical services require screening. Messaging does not book or start treatment.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
