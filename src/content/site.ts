/**
 * Central business facts — Hello You Wellness Center (xlashbyyane.com).
 * Update hours or URLs here to refresh the entire site.
 */
export const site = {
  name: "Hello You Wellness Center",
  legalName: "Hello You Wellness Center",
  shortBrand: "Hello You Wellness",
  tagline:
    "Whole-body wellness in Miami—personalized assisted weight loss, aesthetics, IV therapy, and more.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://xlashbyyane.com",
  phoneDisplay: "(786) 780-3626",
  phoneTel: "+17867803626",
  email: "info@helloyouwellness.com",
  /** Default scheduling (Cal.com) */
  bookingUrl: "https://cal.com/helloyouwellness/secret",
  portalUrl: "https://helloyouwellness.clientsecure.me",
  contactWidgetUrl: "https://helloyouwellness.clientsecure.me/contact-widget",
  instagramHandle: "@xlashbyyaneacademy_",
  instagramUrl: "https://www.instagram.com/xlashbyyaneacademy_/",
  youtubeUrl: "https://www.youtube.com/@HelloYouWellnessClinic",
  googleReviewsUrl:
    "https://www.google.com/maps/search/?api=1&query=Hello%20You%20Wellness%20Center%209660%20SW%2072nd%20St%2C%20Miami%2C%20FL%2033173",
  googleRating: "5.0",
  googleReviewCount: 9,
  address: {
    line1: "9660 SW 72nd St",
    city: "Miami",
    state: "FL",
    zip: "33173",
    country: "US",
  },
  geo: {
    latitude: 25.70585,
    longitude: -80.31345,
  },
  hoursLines: [
    "Monday · By appointment",
    "Tuesday–Friday · 9:00a – 5:00p",
    "Saturday · Closed",
    "Sunday · Closed",
  ],
  hoursSchema: [
    { days: ["Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "17:00" },
  ],
  social: {
    instagram: "https://www.instagram.com/xlashbyyaneacademy_/",
    facebook: "",
    tiktok: "",
    youtube: "https://www.youtube.com/@HelloYouWellnessClinic",
  },
  trustBadges: [
    {
      label: "Licensed medical providers",
      detail:
        "Every treatment is led or supervised by experienced APRNs and medical professionals — never delegated to unlicensed staff.",
    },
    {
      label: "Plans built around you",
      detail: "Your goals, your history, your pace. We design every program from scratch — nothing is templated.",
    },
    {
      label: "Everything under one roof",
      detail:
        "Weight loss, IV therapy, hormone replacement, aesthetics, and skin care — coordinated by a team that knows your full picture.",
    },
    {
      label: "SW Miami — easy to reach",
      detail:
        "9660 SW 72nd St, minutes from Kendall, Westchester, and Coral Gables. Same-week appointments often available.",
    },
  ],
} as const;

export const mapEmbedUrl =
  "https://www.google.com/maps?q=Hello+You+Wellness+Center+9660+SW+72nd+St+Miami+FL+33173&output=embed";
