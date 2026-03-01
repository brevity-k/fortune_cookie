import type { Metadata } from "next";
import LearnPage from "@/components/LearnPage";
import { moonPhasesData } from "@/data/learn/moon-phases";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: moonPhasesData.title,
  description: moonPhasesData.description,
  keywords: moonPhasesData.keywords,
  alternates: { canonical: `${SITE_URL}/learn/moon-phases` },
  openGraph: {
    title: `${moonPhasesData.title} | ${SITE_NAME}`,
    description: moonPhasesData.description,
    url: `${SITE_URL}/learn/moon-phases`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${moonPhasesData.title} | ${SITE_NAME}`,
    description: moonPhasesData.description,
  },
};

export default function MoonPhasesLearnPage() {
  return (
    <LearnPage
      data={moonPhasesData}
      slug="moon-phases"
      relatedLinks={[
        { title: "Tarot Basics", href: "/learn/tarot-basics" },
        { title: "Planets in Astrology", href: "/learn/planets" },
        { title: "Daily Horoscopes", href: "/horoscope" },
      ]}
    />
  );
}
