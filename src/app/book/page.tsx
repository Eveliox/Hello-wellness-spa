import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { TrustChip } from "@/components/ui/trust-chip";

export const metadata: Metadata = createMetadata({
  title: "Book an appointment",
  description: `Schedule a visit at ${site.name} in Miami—online request or phone.`,
  path: "/book",
});

const steps = [
  "Request your visit through our secure booking link (same system as xlashbyyane.com).",
  "Receive confirmation with hours, location, and any intake links.",
  "Meet your provider, review candidacy, and leave with a clear plan.",
];

export default function BookPage() {
  return (
    <>
      <section className="border-b border-line/80 bg-surface py-14">
        <Container className="max-w-3xl">
          <TrustChip>Scheduling</TrustChip>
          <h1 className="mt-4 font-display text-4xl text-balance text-ink sm:text-5xl">
            Book a visit that fits your schedule.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Hello You Wellness uses ClientSecure for appointment requests. Use the button below for the live
            flow, or call us during business hours.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={site.bookingUrl} size="lg">
              Open booking request
            </Button>
            <Button href={`tel:${site.phoneTel}`} variant="secondary" size="lg">
              Call {site.phoneDisplay}
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
            <p className="rounded-2xl border border-line bg-canvas/70 p-4 text-xs text-faint">
              Optional: embed the ClientSecure widget in this column later by adding an iframe in{" "}
              <code className="text-ink">src/app/book/page.tsx</code>.
            </p>
          </div>
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-dashed border-ink/15 bg-surface shadow-inner">
            <div className="border-b border-line bg-canvas/60 px-5 py-3 font-ui text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Embed area (optional)
            </div>
            <div className="flex h-[32rem] flex-col items-center justify-center gap-4 px-6 text-center">
              <p className="text-sm font-medium text-ink">Prefer to book in one tap?</p>
              <Button href={site.bookingUrl} size="lg" className="w-full max-w-xs">
                Continue to booking
              </Button>
              <p className="max-w-md text-xs leading-relaxed text-muted">
                You will leave this preview site and complete scheduling on ClientSecure—matching the experience on{" "}
                <span className="whitespace-nowrap">xlashbyyane.com</span>.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
