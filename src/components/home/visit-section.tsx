import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

export function VisitSection() {
  return (
    <section aria-labelledby="home-visit-heading" className="border-t border-line bg-surface-warm py-14 sm:py-16">
      <Container className="grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h2 id="home-visit-heading" className="font-display text-3xl text-ink sm:text-4xl">Let’s start with a conversation.</h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-ink/75">Not sure which service to choose? Tell us your goals at a free consultation.</p>
          <Button href={site.bookingUrl} size="lg" className="mt-6">Book a free consultation</Button>
        </div>
        <div className="md:justify-self-end">
          <p className="font-semibold text-ink">Visit us in SW Miami</p>
          <address className="mt-2 text-sm not-italic leading-relaxed text-ink/75">
            {site.address.line1}<br />
            {site.address.city}, {site.address.state} {site.address.zip}
          </address>
          <Link href="/contact" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-ink underline underline-offset-4">Hours &amp; directions →</Link>
          <p className="mt-2">
            <a href={site.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-ink/75 underline underline-offset-4">Read our Google reviews <span className="sr-only">(opens in a new tab)</span></a>
          </p>
        </div>
      </Container>
    </section>
  );
}
