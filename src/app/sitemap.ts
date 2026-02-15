import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { CATEGORIES } from "@/lib/fortuneEngine";
import { ZODIAC_SIGNS } from "@/lib/horoscopes";
import { SITE_URL } from "@/lib/constants";

const baseUrl = SITE_URL;
const zodiacKeys = ZODIAC_SIGNS.map((z) => z.key);

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const categoryEntries = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/fortune/${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const zodiacEntries = zodiacKeys.map((sign) => ({
    url: `${baseUrl}/zodiac/${sign}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const staticPageDate = new Date("2026-02-12");

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/daily`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/lucky-numbers`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
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
    ...categoryEntries,
    ...zodiacEntries,
    {
      url: `${baseUrl}/horoscope`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...zodiacKeys.map((sign) => ({
      url: `${baseUrl}/horoscope/daily/${sign}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...zodiacKeys.map((sign) => ({
      url: `${baseUrl}/horoscope/weekly/${sign}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...zodiacKeys.map((sign) => ({
      url: `${baseUrl}/horoscope/monthly/${sign}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...blogEntries,
  ];
}
