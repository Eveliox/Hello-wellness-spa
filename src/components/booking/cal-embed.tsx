"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useRouter } from "next/navigation";

const CAL_BASE = "https://cal.com/";

type Props = {
  /**
   * Cal.com booking link. Accepts either a full URL ("https://cal.com/foo/bar")
   * or a path ("foo/bar"). The embed wants the path form.
   */
  calLink: string;
  /**
   * Identifier passed through to /intake after a successful booking so the
   * intake form can show "Booking confirmed for {service}" context.
   */
  bookedServiceSlug: string;
  /**
   * Cal.com namespace — must be unique per embed mount on the page so multiple
   * services can coexist without colliding event handlers.
   */
  namespace: string;
};

function toCalLinkPath(input: string): string {
  if (input.startsWith(CAL_BASE)) return input.slice(CAL_BASE.length);
  return input.replace(/^https?:\/\/cal\.com\//, "");
}

export function CalEmbed({ calLink, bookedServiceSlug, namespace }: Props) {
  const router = useRouter();
  const path = toCalLinkPath(calLink);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const cal = await getCalApi({ namespace });
      if (cancelled) return;

      const brandVars = {
        "cal-brand": "#1a1a1a",
        "cal-text": "#212020",
        "cal-text-muted": "#757575",
        "cal-border": "#dbdbdb",
        "cal-bg": "#ffffff",
        "cal-bg-muted": "#f7f7f7",
      };
      cal("ui", {
        cssVarsPerTheme: { light: brandVars, dark: brandVars },
        hideEventTypeDetails: false,
        layout: "month_view",
      });

      cal("on", {
        action: "bookingSuccessfulV2",
        callback: (e) => {
          const detail = (e as CustomEvent<{ data?: { startTime?: string } }>).detail;
          const startTime = detail?.data?.startTime ?? "";
          const params = new URLSearchParams({
            booked: "1",
            service: bookedServiceSlug,
          });
          if (startTime) params.set("at", startTime);
          router.push(`/intake?${params.toString()}`);
        },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [namespace, bookedServiceSlug, router]);

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
      <Cal
        namespace={namespace}
        calLink={path}
        style={{ width: "100%", height: "100%", minHeight: 640, overflow: "scroll" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
