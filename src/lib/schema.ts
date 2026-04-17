import { site } from "@/content/site";

export function localBusinessJsonLd() {
  const ratingValue = Number.parseFloat(String(site.googleRating));
  const aggregateRating =
    Number.isFinite(ratingValue) && site.googleReviewCount
      ? {
          "@type": "AggregateRating",
          ratingValue,
          reviewCount: site.googleReviewCount,
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": ["MedicalClinic", "HealthAndBeautyBusiness", "LocalBusiness"],
    name: site.name,
    description: site.tagline,
    url: site.url,
    telephone: site.phoneDisplay,
    image: `${site.url}/og-placeholder.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    openingHoursSpecification: site.hoursSchema.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    ...(aggregateRating ? { aggregateRating } : {}),
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Assisted weight loss" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "IV therapy" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Aesthetics & skin care" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hormone therapy" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Research peptides" } },
    ],
    priceRange: "$$",
    areaServed: { "@type": "City", name: "Miami" },
    sameAs: [site.googleReviewsUrl, ...Object.values(site.social)].filter(Boolean),
  };
}
