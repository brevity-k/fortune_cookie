import type { Metadata } from "next";
import LearnPage from "@/components/LearnPage";
import { elementsData } from "@/data/learn/elements";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: elementsData.title,
  description: elementsData.description,
  keywords: elementsData.keywords,
  alternates: { canonical: `${SITE_URL}/learn/elements` },
  openGraph: {
    title: `${elementsData.title} | ${SITE_NAME}`,
    description: elementsData.description,
    url: `${SITE_URL}/learn/elements`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${elementsData.title} | ${SITE_NAME}`,
    description: elementsData.description,
  },
};

export default function ElementsLearnPage() {
  return (
    <LearnPage
      data={elementsData}
      slug="elements"
      relatedLinks={[
        { title: "Zodiac Signs Guide", href: "/learn/zodiac-signs" },
        { title: "Planets in Astrology", href: "/learn/planets" },
        { title: "Daily Horoscopes", href: "/horoscope" },
      ]}
    />
  );
}
