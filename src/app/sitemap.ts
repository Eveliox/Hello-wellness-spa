import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { programs } from "@/content/programs";
import { programsEs } from "@/content/programs.es";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/programs",
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

  // Program landing pages (en + es). These were previously absent entirely,
  // which kept the whole /programs tree out of search results.
  programs.forEach((p) => {
    entries.push({
      url: `${base}/programs/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  programsEs.forEach((p) => {
    entries.push({
      url: `${base}/programas/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  });

  // Packages & pricing — the only directly purchasable page on the site, so it
  // outranks everything except the homepage.
  entries.push({
    url: `${base}/programs/packages`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.95,
  });

  return entries;
}
