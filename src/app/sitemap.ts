import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";

const baseUrl = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const latestPostDate = blogEntries.length > 0
    ? new Date(Math.max(...blogEntries.map((e) => e.lastModified.getTime())))
    : new Date("2026-02-12");

  const staticPageDate = new Date("2026-02-12");

  return [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/lucky-numbers`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: staticPageDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: staticPageDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: staticPageDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: staticPageDate,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...blogEntries,
  ];
}
