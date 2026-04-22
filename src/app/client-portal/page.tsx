import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { TrustChip } from "@/components/ui/trust-chip";

export const metadata: Metadata = createMetadata({
  title: "Client portal",
  description: `Access forms, invoices, and visit history for ${site.name}.`,
  path: "/client-portal",
});

export default function ClientPortalPage() {
  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        <TrustChip>Secure access</TrustChip>
        <h1 className="mt-4 font-display text-4xl text-balance text-ink sm:text-5xl">
          Client portal
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted">
          Access your intake forms, visit history, invoices, and aftercare instructions — all in one secure place.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            href={site.portalUrl}
            size="lg"
            className="bg-[#1a1a1a] text-white hover:bg-[#1a1a1a]/90"
            target="_blank"
            rel="noopener noreferrer"
          >
            Access Client Portal
          </Button>
        </div>
        <p className="mt-3 text-xs text-faint">
          New patient? Your portal account is created after your first visit. Call us if you need help getting set up.
        </p>

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
