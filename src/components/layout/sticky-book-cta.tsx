"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";

type CtaConfig = {
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

/**
 * Decide which mobile sticky CTA pair to render for the current path.
 * Returns `null` to hide the bar entirely on pages where the user is already
 * mid-flow (booking, intake, checkout, quiz) or where a different CTA owns
 * the screen (peptides, admin).
 */
function getCtaForPath(pathname: string): CtaConfig | null {
  if (pathname === "/services/peptide-therapy") return null;
  if (pathname.startsWith("/checkout")) return null;
  if (pathname.startsWith("/book")) return null;
  if (pathname.startsWith("/intake")) return null;
  if (pathname.startsWith("/quiz")) return null;
  if (pathname.startsWith("/admin")) return null;

  if (pathname === "/services/assisted-weight-loss") {
    return {
      primary: { label: "Start GLP-1 intake", href: "/intake/glp1" },
      secondary: { label: "Book consult", href: "/book?service=assisted-weight-loss" },
    };
  }

  if (pathname === "/services/aesthetics-cosmetics") {
    return {
      primary: { label: "Book Aesthetics", href: "/book?service=aesthetics-cosmetics" },
      secondary: { label: "Take the quiz", href: "/quiz" },
    };
  }

  if (pathname === "/services/iv-therapy") {
    return {
      primary: { label: "Book IV session", href: "/book?service=iv-therapy" },
      secondary: { label: "Take the quiz", href: "/quiz" },
    };
  }

  if (pathname === "/services/build-your-own-iv") {
    return {
      primary: { label: "Book IV", href: "/book?service=iv-therapy" },
      secondary: { label: "Take the quiz", href: "/quiz" },
    };
  }

  if (pathname === "/services/galleri") {
    return {
      primary: { label: "Book consult", href: "/book" },
      secondary: { label: "Take the quiz", href: "/quiz" },
    };
  }

  return {
    primary: { label: "Book a visit", href: "/book" },
    secondary: { label: "Take the quiz", href: "/quiz" },
  };
}

export function StickyBookCta() {
  const pathname = usePathname();
  const cta = getCtaForPath(pathname);
  if (!cta) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-chrome/98 p-3 shadow-[0_-12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-2 text-on-chrome">
        <Link
          href={`tel:${site.phoneTel}`}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs font-semibold text-white"
          aria-label={`Call ${site.phoneDisplay}`}
        >
          Call
        </Link>
        <Button
          href={cta.secondary.href}
          variant="ghostInverse"
          size="md"
          className="flex-1 border border-white/20"
        >
          {cta.secondary.label}
        </Button>
        <Button href={cta.primary.href} variant="inverse" size="md" className="flex-1">
          {cta.primary.label}
        </Button>
      </div>
    </div>
  );
}
