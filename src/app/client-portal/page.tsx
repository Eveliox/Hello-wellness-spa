import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = createMetadata({
  title: "Client portal",
  description: `Access forms, invoices, and visit history for ${site.name}.`,
  path: "/client-portal",
});

export default function ClientPortalPage() {
  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
          <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
          Secure access
        </p>
        <h1 className="mt-4 font-display text-4xl text-balance text-ink sm:text-5xl">
          Your client{" "}
          <span className="font-script text-[1.3em] font-normal italic leading-none text-[#E8B4A3]">
            portal
          </span>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted">
          Access your intake forms, visit history, invoices, and aftercare instructions — all in one secure place.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">New patient</p>
            <p className="mt-2 text-base font-semibold text-ink">Start your registration</p>
            <p className="mt-2 text-sm text-muted">
              Complete your intake form before your first visit so we can prepare for you.
            </p>
            <Button href="/intake" size="lg" className="mt-5">
              Complete Registration Form
            </Button>
          </div>

          <div className="flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Returning patient</p>
            <p className="mt-2 text-base font-semibold text-ink">Access your portal</p>
            <p className="mt-2 text-sm text-muted">
              View visit history, invoices, aftercare, and refill requests.
            </p>
            <Button
              href={site.portalUrl}
              size="lg"
              variant="secondary"
              className="mt-5"
              target="_blank"
              rel="noopener noreferrer"
            >
              Access Client Portal
            </Button>
          </div>
        </div>

        <div className="mt-10 rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm">
          <p className="text-sm font-semibold text-ink">What you can do in the portal</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-ink" aria-hidden>✓</span>
              Complete intake and consent forms before arrival
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-ink" aria-hidden>✓</span>
              Review treatment plans and aftercare instructions
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-ink" aria-hidden>✓</span>
              Pay balances and download receipts for HSA/FSA records
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-ink" aria-hidden>✓</span>
              Request prescription refills when clinically appropriate
            </li>
          </ul>
        </div>

        <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm">
          <p className="text-sm font-semibold text-ink">Need help?</p>
          <p className="mt-1 text-sm text-muted">
            Can't log in, missing access, or have a question about your account — reach out and we'll sort it out.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button href={`tel:${site.phoneTel}`} variant="secondary" size="sm">
              Call {site.phoneDisplay}
            </Button>
            <Button href="/contact" variant="ghost" size="sm">
              Send a message
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
