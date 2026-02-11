import type { MetadataRoute } from "next";

const baseUrl = "https://fortunecrack.com";

const blogSlugs = [
  "history-of-fortune-cookies",
  "fortune-cookie-traditions",
  "building-interactive-web-games",
  "psychology-of-fortune-telling",
  "digital-fortune-cookies-future",
  "lucky-numbers-superstitions-science",
  "morning-rituals-around-the-world",
  "famous-fortunes-that-came-true",
  "zodiac-fortune-cookies-astrology-meets-wisdom",
  "why-we-need-small-joys",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...blogEntries,
  ];
}
