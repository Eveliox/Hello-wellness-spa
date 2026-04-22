import type { Metadata } from "next";
import Image from "next/image";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: `Message ${site.name} in Miami or call ${site.phoneDisplay} for concierge support.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line/80">
        <Image
          src="/images/connect.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden />
        <Container className="relative max-w-3xl py-24 sm:py-32">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8B4A3]">
            <span className="h-px w-6 bg-[#E8B4A3]" aria-hidden />
            Contact
          </p>
          <h1 className="mt-4 font-display text-4xl text-balance text-white sm:text-5xl">
            Talk with our{" "}
            <span className="font-script text-[1.3em] font-normal italic leading-none text-[#E8B4A3]">
              concierge
            </span>{" "}
            team
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/80">
            For timely answers, include your goal and preferred appointment window. Medical questions are reviewed
            by a licensed provider.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-3xl">
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
        </Container>
      </section>
    </>
  );
}
