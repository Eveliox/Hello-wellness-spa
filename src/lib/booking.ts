import type { ServiceSlug } from "@/content/services";
import { site } from "@/content/site";

const cal = {
  general: "https://cal.com/helloyouwellness/secret",
  weight: "https://cal.com/helloyouwellness/30min",
  iv: "https://cal.com/helloyouwellness/15min",
  aesthetics: "https://cal.com/helloyouwellness/aesthetics-consultation",
} as const;

export function bookingUrlForServiceSlug(slug: ServiceSlug) {
  switch (slug) {
    case "assisted-weight-loss":
      return cal.weight;
    case "iv-therapy":
    case "build-your-own-iv":
      return cal.iv;
    case "aesthetics-cosmetics":
      return cal.aesthetics;
    default:
      return site.bookingUrl;
  }
}
