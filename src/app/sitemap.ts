import type { MetadataRoute } from "next";
import { projects, SITE_URL } from "@/content";
import { articles } from "@/writing";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${SITE_URL}/work/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      url: `${SITE_URL}/writing/${article.slug}`,
      lastModified: article.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
