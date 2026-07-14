"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = {
  bookingService: string | undefined;
};

/**
 * Fires `book_appointment_confirmed` on /intake?booked=1 load. This is the
 * safety-net event that catches races where the Cal iframe callback lost to
 * the redirect and `book_appointment` never made it into the dataLayer.
 *
 * GTM should dedupe against `book_appointment` on the same session/service to
 * avoid double-counting when both fire.
 */
export function BookingConfirmedPixel({ bookingService }: Props) {
  useEffect(() => {
    trackEvent("book_appointment_confirmed", {
      booking_service: bookingService ?? "unknown",
    });
    // Fire once on mount for this booked=1 landing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
