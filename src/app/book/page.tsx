import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = createMetadata({
  title: "Book a visit",
  description: `Book a consultation or treatment at ${site.name} in SW Miami.`,
  path: "/book",
});

const steps = [
  "Book online in under 2 minutes — pick your service and a time that works for you.",
  "We'll send a confirmation and any intake forms to complete before your visit.",
  "Arrive with a clear plan — screening and suitability are confirmed before any medical service.",
];

export default function BookPage() {
  return (
    <>
      <section className="border-b border-line/80 bg-surface py-14">
        <Container className="max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
            <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
            Book a visit
          </p>
          <h1 className="mt-4 font-display text-4xl text-balance text-ink sm:text-5xl">
            Reserve your{" "}
            <span className="font-script text-[1.3em] font-normal italic leading-none text-[#E8B4A3]">
              visit
            </span>{" "}
            online.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Select a service and a time that works for you — most consultations are available same week.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              href={site.bookingUrl}
              size="lg"
              className="bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90"
            >
              Book Online
            </Button>
            <Button href={`tel:${site.phoneTel}`} variant="secondary" size="lg">
              Call {site.phoneDisplay}
            </Button>
            <Button href="/contact" variant="ghost" size="lg">
              Send a message
            </Button>
          </div>
          <p className="mt-4 text-xs text-faint">
            Prefer Instagram? DM us at{" "}
            <a
              href={site.social.instagram}
              className="underline underline-offset-2 hover:text-ink"
              target="_blank"
              rel="noopener noreferrer"
            >
              {site.instagramHandle}
            </a>
            .
          </p>
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
            <p className="pt-2 text-xs text-faint">
              Medical services require screening. Booking confirms a time slot — suitability is reviewed before any treatment begins.
            </p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Quick links</p>
            <h3 className="mt-3 font-display text-2xl text-ink">Book by service</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button
                href="https://cal.com/helloyouwellness/30min"
                size="lg"
                className="w-full bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90"
              >
                Weight Loss
              </Button>
              <Button
                href="https://cal.com/helloyouwellness/aesthetics-consultation"
                variant="secondary"
                size="lg"
                className="w-full"
              >
                Aesthetics
              </Button>
              <Button
                href="https://cal.com/helloyouwellness/15min"
                variant="secondary"
                size="lg"
                className="w-full"
              >
                IV Therapy
              </Button>
              <Button
                href={site.bookingUrl}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                General / Other
              </Button>
            </div>
            <div className="mt-6 border-t border-line pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">New patient?</p>
              <p className="mt-1.5 text-xs text-muted">Please complete your registration form before your first visit.</p>
              <Button href="/intake" variant="secondary" size="sm" className="mt-3 w-full">
                Complete Registration Form
              </Button>
            </div>
            <div className="mt-6 border-t border-line pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Prefer to talk first?</p>
              <div className="mt-3 flex gap-3">
                <Button href={`tel:${site.phoneTel}`} variant="secondary" size="sm" className="flex-1">
                  Call us
                </Button>
                <Button href={site.social.instagram} variant="ghost" size="sm" className="flex-1">
                  Instagram DM
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
