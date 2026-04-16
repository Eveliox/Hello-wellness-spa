import Link from "next/link";
import { footerGroups } from "@/content/navigation";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-chrome text-[#d0d0d0]">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5">
            <p className="font-display text-3xl text-white">{site.name}</p>
            <p className="max-w-md text-sm leading-relaxed text-white/70">{site.tagline}</p>
            <div className="space-y-1 text-sm text-white/70">
              <p>{site.address.line1}</p>
              <p>
                {site.address.city}, {site.address.state} {site.address.zip}
              </p>
              <p className="pt-2 font-ui text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Hours</p>
              <ul className="space-y-1">
                {site.hoursLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <a className="font-medium text-white hover:underline" href={`tel:${site.phoneTel}`}>
                {site.phoneDisplay}
              </a>
              <span className="text-white/25">|</span>
              <a className="font-medium text-white hover:underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
            <div className="flex gap-3 pt-2">
              {site.social.instagram ? (
                <a
                  href={site.social.instagram}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-white/80 transition hover:border-white/35 hover:text-white"
                  aria-label="Instagram"
                >
                  IG
                </a>
              ) : null}
              {site.social.youtube ? (
                <a
                  href={site.social.youtube}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-white/80 transition hover:border-white/35 hover:text-white"
                  aria-label="YouTube"
                >
                  YT
                </a>
              ) : null}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            <NewsletterForm tone="dark" />
            <div className="grid gap-8 sm:col-span-2 sm:grid-cols-3 lg:col-span-1 lg:grid-cols-3">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <p className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                    {group.title}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link className="text-white/70 transition hover:text-white" href={link.href}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/policies" className="hover:text-white">
              Policies
            </Link>
            <Link href="/faq" className="hover:text-white">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
