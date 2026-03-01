import type { Metadata } from "next";
import LearnPage from "@/components/LearnPage";
import { zodiacSignsData } from "@/data/learn/zodiac-signs";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: zodiacSignsData.title,
  description: zodiacSignsData.description,
  keywords: zodiacSignsData.keywords,
  alternates: { canonical: `${SITE_URL}/learn/zodiac-signs` },
  openGraph: {
    title: `${zodiacSignsData.title} | ${SITE_NAME}`,
    description: zodiacSignsData.description,
    url: `${SITE_URL}/learn/zodiac-signs`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${zodiacSignsData.title} | ${SITE_NAME}`,
    description: zodiacSignsData.description,
  },
};

export default function ZodiacSignsLearnPage() {
  return (
    <LearnPage
      data={zodiacSignsData}
      slug="zodiac-signs"
      relatedLinks={[
        { title: "Daily Horoscopes", href: "/horoscope" },
        { title: "Zodiac Fortunes", href: "/zodiac/aries" },
        { title: "The Four Elements", href: "/learn/elements" },
      ]}
    />
  );
}
