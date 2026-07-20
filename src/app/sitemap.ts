import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { services } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/contact",
    "/faq",
    "/policies",
    "/book",
    "/quiz",
    "/memberships",
    "/refer",
    "/partners",
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  services.forEach((s) => {
    entries.push({
      url: `${base}/services/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  entries.push({
    url: `${base}/services/galleri`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  });

  [
    "/services/endolift-miami",
    "/services/trt-miami",
    "/services/pdo-threads-miami",
    "/services/non-surgical-bbl-miami",
    "/services/mobile-iv-miami",
  ].forEach((path) => {
    entries.push({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    });
  });

  return entries;
}
