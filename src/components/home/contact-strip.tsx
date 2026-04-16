import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { TrustChip } from "@/components/ui/trust-chip";

export function ContactStrip() {
  return (
    <section className="py-16">
      <Container className="rounded-[2rem] border border-line bg-surface p-8 shadow-soft sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <TrustChip>Visit us</TrustChip>
            <h2 className="font-display text-3xl text-balance text-ink sm:text-4xl">
              See us on SW 72nd St—or start with a quick call.
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              {site.address.line1}, {site.address.city}, {site.address.state} {site.address.zip}
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <a className="font-semibold text-ink hover:underline" href={`tel:${site.phoneTel}`}>
                {site.phoneDisplay}
              </a>
              <span className="text-line">·</span>
              <a className="font-semibold text-ink hover:underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
            <div>
              <p className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-muted">Hours</p>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {site.hoursLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button href="/contact" size="lg" variant="secondary" className="w-full">
              Contact form
            </Button>
            <Button href={site.bookingUrl} size="lg" className="w-full">
              Book appointment
            </Button>
            <Button href={site.portalUrl} size="lg" variant="subtle" className="w-full">
              Client portal login
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
