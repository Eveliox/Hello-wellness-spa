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
  phoneDisplay: "(305) 640-5351",
  phoneTel: "+13056405351",
  email: "info@helloyouwellness.com",
  /** Live scheduling (ClientSecure) */
  bookingUrl: "https://helloyouwellness.clientsecure.me/request",
  portalUrl: "https://helloyouwellness.clientsecure.me",
  contactWidgetUrl: "https://helloyouwellness.clientsecure.me/contact-widget",
  externalStoreUrl: "https://xlashbyyane.com/hyw-store",
  instagramHandle: "@xlashbyyaneacademy_",
  instagramUrl: "https://www.instagram.com/xlashbyyaneacademy_/",
  youtubeUrl: "https://www.youtube.com/@HelloYouWellnessClinic",
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
    "Saturday · 10:00a – 3:00p",
    "Sunday · Closed",
  ],
  hoursSchema: [
    { days: ["Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "17:00" },
    { days: ["Saturday"], opens: "10:00", closes: "15:00" },
  ],
  social: {
    instagram: "https://www.instagram.com/xlashbyyaneacademy_/",
    facebook: "",
    tiktok: "",
    youtube: "https://www.youtube.com/@HelloYouWellnessClinic",
  },
  trustBadges: [
    { label: "Licensed providers", detail: "Experienced medical and APRN-led aesthetics care" },
    { label: "Personalized plans", detail: "Holistic support for your goals—not one-size templates" },
    { label: "Full-service wellness", detail: "Weight, IV, hormones, skin, and recovery under one roof" },
    { label: "SW Miami location", detail: "9660 SW 72nd St — easy access from Kendall & surrounding areas" },
  ],
} as const;

export const mapEmbedUrl =
  "https://www.google.com/maps?q=Hello+You+Wellness+Center+9660+SW+72nd+St+Miami+FL+33173&output=embed";
