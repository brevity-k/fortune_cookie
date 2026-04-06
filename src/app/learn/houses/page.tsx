import type { Metadata } from "next";
import LearnPage from "@/components/LearnPage";
import { housesData } from "@/data/learn/houses";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: housesData.title,
  description: housesData.description,
  keywords: housesData.keywords,
  alternates: { canonical: `${SITE_URL}/learn/houses` },
  openGraph: {
    title: `${housesData.title} | ${SITE_NAME}`,
    description: housesData.description,
    url: `${SITE_URL}/learn/houses`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${housesData.title} | ${SITE_NAME}`,
    description: housesData.description,
  },
};

export default function HousesLearnPage() {
  return (
    <LearnPage
      data={housesData}
      slug="houses"
      relatedLinks={[
        { title: "Planets in Astrology", href: "/learn/planets" },
        { title: "Zodiac Signs Guide", href: "/zodiac/aries" },
        { title: "Learn Hub", href: "/learn" },
      ]}
    />
  );
}
