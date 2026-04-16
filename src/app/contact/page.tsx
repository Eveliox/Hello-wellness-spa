import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/forms/contact-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: `Message ${site.name} in Miami or call ${site.phoneDisplay} for concierge support.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line/80 bg-surface py-14">
        <Container className="max-w-3xl">
          <h1 className="font-display text-4xl text-balance text-ink sm:text-5xl">Talk with our concierge team</h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            For timely answers, include your goal and preferred appointment window. Medical questions are reviewed
            by a licensed provider. Prefer the widget on our main site?{" "}
            <a className="font-semibold text-ink underline-offset-2 hover:underline" href={site.contactWidgetUrl}>
              Open the contact form ↗
            </a>
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6 text-sm text-muted">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Phone</p>
              <a className="mt-2 block text-lg font-semibold text-accent hover:underline" href={`tel:${site.phoneTel}`}>
                {site.phoneDisplay}
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Email</p>
              <a className="mt-2 block text-lg font-semibold text-accent hover:underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Studio</p>
              <p className="mt-2">
                {site.address.line1}
                <br />
                {site.address.city}, {site.address.state} {site.address.zip}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Hours</p>
              <ul className="mt-2 space-y-1">
                {site.hoursLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button href={`tel:${site.phoneTel}`} size="lg" className="w-full sm:w-auto">
                Call {site.phoneDisplay}
              </Button>
              <Button href={site.social.instagram} variant="secondary" size="lg" className="w-full sm:w-auto">
                Instagram
              </Button>
            </div>
          </div>
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-2xl text-ink">Send a message</h2>
            <p className="mt-2 text-sm text-muted">We reply within one business day—often sooner.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
