import type { Metadata } from "next";
import LearnPage from "@/components/LearnPage";
import { chineseZodiacData } from "@/data/learn/chinese-zodiac";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: chineseZodiacData.title,
  description: chineseZodiacData.description,
  keywords: chineseZodiacData.keywords,
  alternates: { canonical: `${SITE_URL}/learn/chinese-zodiac` },
  openGraph: {
    title: `${chineseZodiacData.title} | ${SITE_NAME}`,
    description: chineseZodiacData.description,
    url: `${SITE_URL}/learn/chinese-zodiac`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${chineseZodiacData.title} | ${SITE_NAME}`,
    description: chineseZodiacData.description,
  },
};

export default function ChineseZodiacLearnPage() {
  return (
    <LearnPage
      data={chineseZodiacData}
      slug="chinese-zodiac"
      relatedLinks={[
        { title: "Zodiac Signs Guide", href: "/learn/zodiac-signs" },
        { title: "Numerology", href: "/learn/numerology" },
        { title: "Fortune Cookie History", href: "/learn/fortune-cookie-history" },
      ]}
    />
  );
}
