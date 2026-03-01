import type { Metadata } from "next";
import LearnPage from "@/components/LearnPage";
import { planetsData } from "@/data/learn/planets";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: planetsData.title,
  description: planetsData.description,
  keywords: planetsData.keywords,
  alternates: { canonical: `${SITE_URL}/learn/planets` },
  openGraph: {
    title: `${planetsData.title} | ${SITE_NAME}`,
    description: planetsData.description,
    url: `${SITE_URL}/learn/planets`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${planetsData.title} | ${SITE_NAME}`,
    description: planetsData.description,
  },
};

export default function PlanetsLearnPage() {
  return (
    <LearnPage
      data={planetsData}
      slug="planets"
      relatedLinks={[
        { title: "Astrological Houses", href: "/learn/houses" },
        { title: "Zodiac Signs Guide", href: "/learn/zodiac-signs" },
        { title: "The Four Elements", href: "/learn/elements" },
      ]}
    />
  );
}
