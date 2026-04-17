 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { footerGroups } from "@/content/navigation";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export function Footer() {
  const pathname = usePathname();
  const isPeptidesPage = pathname === "/services/peptide-therapy";

  const safeFooterGroups = isPeptidesPage ? footerGroups.filter((group) => group.title !== "Care") : footerGroups;

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
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M16.5 7.5h.01M7.75 2.75h8.5A4.999 4.999 0 0 1 21.25 7.75v8.5a4.999 4.999 0 0 1-5 5h-8.5a4.999 4.999 0 0 1-5-5v-8.5a4.999 4.999 0 0 1 5-5Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 16.25a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              ) : null}
              {site.social.tiktok ? (
                <a
                  href={site.social.tiktok}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-white/80 transition hover:border-white/35 hover:text-white"
                  aria-label="TikTok"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path
                      d="M14.25 3.75v10.2a3.45 3.45 0 0 1-3.45 3.45 3.45 3.45 0 0 1-3.45-3.45 3.45 3.45 0 0 1 3.15-3.43V9.9a5.7 5.7 0 0 0-.9-.07A5.7 5.7 0 0 0 3.9 15.45 5.7 5.7 0 0 0 9.6 21.15a5.7 5.7 0 0 0 5.7-5.7V8.1a6.9 6.9 0 0 0 4.05 1.3V7.05a4.95 4.95 0 0 1-2.85-.9A4.95 4.95 0 0 1 14.25 3.75Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              ) : null}
              {site.social.youtube ? (
                <a
                  href={site.social.youtube}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-white/80 transition hover:border-white/35 hover:text-white"
                  aria-label="YouTube"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M21.6 7.2a3.01 3.01 0 0 0-2.12-2.13C17.62 4.6 12 4.6 12 4.6s-5.62 0-7.48.47A3.01 3.01 0 0 0 2.4 7.2 31.6 31.6 0 0 0 2 12a31.6 31.6 0 0 0 .4 4.8 3.01 3.01 0 0 0 2.12 2.13c1.86.47 7.48.47 7.48.47s5.62 0 7.48-.47a3.01 3.01 0 0 0 2.12-2.13A31.6 31.6 0 0 0 22 12a31.6 31.6 0 0 0-.4-4.8Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                    <path d="M10 9.5v5l5-2.5-5-2.5Z" fill="currentColor" />
                  </svg>
                </a>
              ) : null}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            <NewsletterForm tone="dark" />
            <div className="grid gap-8 sm:col-span-2 sm:grid-cols-3 lg:col-span-1 lg:grid-cols-3">
              {safeFooterGroups.map((group) => (
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
        <p className="mt-6 max-w-3xl text-[11px] leading-relaxed text-white/45">
          Hello You Wellness Center is a licensed medical practice in Miami, FL. All medical services are provided by licensed APRNs under physician supervision.
        </p>
      </Container>
    </footer>
  );
}
