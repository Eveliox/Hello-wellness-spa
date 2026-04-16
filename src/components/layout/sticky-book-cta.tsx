"use client";

import Link from "next/link";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";

export function StickyBookCta() {
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
        <Button href="/quiz" variant="ghostInverse" size="md" className="flex-1 border border-white/20">
          Take the quiz
        </Button>
        <Button href={site.bookingUrl} variant="inverse" size="md" className="flex-1">
          Book
        </Button>
      </div>
    </div>
  );
}
