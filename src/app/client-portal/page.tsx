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
          Your client portal—organized, private, always current.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted">
          Sign in to the same ClientSecure portal linked from our main site for forms, scheduling context, and
          account tools.
        </p>
        <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm">
          <p className="text-sm font-semibold text-ink">What you can do in the portal</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Complete intake and consent forms before arrival</li>
            <li>Review treatment plans and aftercare instructions</li>
            <li>Pay balances and download receipts for HSA/FSA records</li>
            <li>Request prescription refills when clinically appropriate</li>
          </ul>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href={site.portalUrl} size="lg">
            Open client portal
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            Need login help?
          </Button>
        </div>
      </Container>
    </section>
  );
}
