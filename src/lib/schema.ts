import { site } from "@/content/site";

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalClinic", "HealthAndBeautyBusiness"],
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
    priceRange: "$$",
    areaServed: { "@type": "City", name: "Miami" },
    sameAs: Object.values(site.social).filter(Boolean),
  };
}
