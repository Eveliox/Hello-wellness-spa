"use client";

import { useState } from "react";
import { CalEmbed } from "./cal-embed";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type Service = {
  slug: string;
  label: string;
  calLink: string;
  namespace: string;
};

const SERVICES: Service[] = [
  {
    slug: "assisted-weight-loss",
    label: "Weight Loss",
    calLink: "https://cal.com/helloyouwellness/30min",
    namespace: "weightloss",
  },
  {
    slug: "aesthetics-cosmetics",
    label: "Aesthetics",
    calLink: "https://cal.com/helloyouwellness/aesthetics-consultation",
    namespace: "aesthetics",
  },
  {
    slug: "iv-therapy",
    label: "IV Therapy",
    calLink: "https://cal.com/helloyouwellness/15min",
    namespace: "iv",
  },
  {
    slug: "general",
    label: "General / Other",
    calLink: "https://cal.com/helloyouwellness/secret",
    namespace: "general",
  },
];

type Props = {
  initialSlug?: string;
};

export function BookingPicker({ initialSlug }: Props) {
  const initial = SERVICES.find((s) => s.slug === initialSlug) ?? SERVICES[0];
  const [active, setActive] = useState<Service>(initial);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Select a service to book"
        className="flex flex-wrap gap-2 border-b border-line pb-4"
      >
        {SERVICES.map((s) => {
          const isActive = s.slug === active.slug;
          return (
            <button
              key={s.slug}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => {
                setActive(s);
                // Fires the pre-load booking intent so we still capture data
                // if the Cal iframe never confirms (drop-off, close before submit).
                trackEvent("book_click", {
                  cta_location: "booking_picker_tab",
                  booking_service: s.slug,
                });
              }}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-ink/15",
                isActive
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-surface text-ink hover:border-ink/40",
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <CalEmbed
          key={active.namespace}
          calLink={active.calLink}
          bookedServiceSlug={active.slug}
          namespace={active.namespace}
        />
      </div>

      <p className="mt-4 text-xs text-faint">
        After booking, we&apos;ll take you to a short intake form so we can prepare for your visit.
      </p>
    </div>
  );
}
