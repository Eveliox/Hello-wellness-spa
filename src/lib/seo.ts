import type { Metadata } from "next";
import { site } from "@/content/site";

export function createMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = new URL(path, site.url).toString();
  const fullTitle = title === site.name ? title : `${title} | ${site.name}`;

  const explicitImages = image
    ? [{ url: image, width: 1200, height: 630, alt: site.name }]
    : undefined;

  return {
    metadataBase: new URL(site.url),
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      locale: "en_US",
      type: "website",
      ...(explicitImages ? { images: explicitImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(image ? { images: [image] } : {}),
    },
    robots: { index: true, follow: true },
  };
}
