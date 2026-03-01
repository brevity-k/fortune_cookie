import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";
import { ZODIAC_SIGNS } from "@/lib/horoscopes";
import { CATEGORIES } from "@/lib/fortuneEngine";

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

  // Horoscope pages: hub + daily/weekly/monthly for all 12 signs
  const horoscopeEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/horoscope`,
      lastModified: today,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    ...ZODIAC_SIGNS.flatMap((sign) => [
      {
        url: `${baseUrl}/horoscope/daily/${sign.key}`,
        lastModified: today,
        changeFrequency: "daily" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/horoscope/weekly/${sign.key}`,
        lastModified: today,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/horoscope/monthly/${sign.key}`,
        lastModified: today,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      },
    ]),
  ];

  // Category fortune pages
  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/fortune/${cat}`,
    lastModified: today,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  // Zodiac fortune pages
  const zodiacEntries: MetadataRoute.Sitemap = ZODIAC_SIGNS.map((sign) => ({
    url: `${baseUrl}/zodiac/${sign.key}`,
    lastModified: today,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  // Daily fortune page
  const dailyEntry: MetadataRoute.Sitemap[number] = {
    url: `${baseUrl}/daily`,
    lastModified: today,
    changeFrequency: "daily" as const,
    priority: 0.7,
  };

  // Editorial policy page
  const editorialEntry: MetadataRoute.Sitemap[number] = {
    url: `${baseUrl}/editorial-policy`,
    lastModified: staticPageDate,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  };

  return [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: "daily",
      priority: 1,
    },
    dailyEntry,
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
    editorialEntry,
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
    ...horoscopeEntries,
    ...categoryEntries,
    ...zodiacEntries,
    ...blogEntries,
  ];
}
