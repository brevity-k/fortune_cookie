import type { Metadata } from "next";
import LearnPage from "@/components/LearnPage";
import { tarotBasicsData } from "@/data/learn/tarot-basics";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: tarotBasicsData.title,
  description: tarotBasicsData.description,
  keywords: tarotBasicsData.keywords,
  alternates: { canonical: `${SITE_URL}/learn/tarot-basics` },
  openGraph: {
    title: `${tarotBasicsData.title} | ${SITE_NAME}`,
    description: tarotBasicsData.description,
    url: `${SITE_URL}/learn/tarot-basics`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${tarotBasicsData.title} | ${SITE_NAME}`,
    description: tarotBasicsData.description,
  },
};

export default function TarotBasicsLearnPage() {
  return (
    <LearnPage
      data={tarotBasicsData}
      slug="tarot-basics"
      relatedLinks={[
        { title: "Moon Phases Guide", href: "/learn/moon-phases" },
        { title: "Zodiac Signs Guide", href: "/zodiac/aries" },
        { title: "Daily Horoscopes", href: "/horoscope" },
      ]}
    />
  );
}
