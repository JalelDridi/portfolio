import type { MetadataRoute } from "next";
import { projects, SITE_URL } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${SITE_URL}/work/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
