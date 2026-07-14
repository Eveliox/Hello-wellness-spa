"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = Omit<ComponentProps<typeof Link>, "onClick"> & {
  eventName: string;
  eventParams?: Record<string, unknown>;
};

/**
 * Thin client-side wrapper around next/link that fires a dataLayer event on
 * click. Kept minimal so server components (like GettingStartedSection) can
 * still opt into tracking without becoming client components themselves.
 */
export function TrackedCtaLink({ eventName, eventParams, children, ...linkProps }: Props) {
  return (
    <Link {...linkProps} onClick={() => trackEvent(eventName, eventParams)}>
      {children}
    </Link>
  );
}
