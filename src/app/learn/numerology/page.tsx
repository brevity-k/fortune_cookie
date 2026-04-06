import type { Metadata } from "next";
import LearnPage from "@/components/LearnPage";
import { numerologyData } from "@/data/learn/numerology";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: numerologyData.title,
  description: numerologyData.description,
  keywords: numerologyData.keywords,
  alternates: { canonical: `${SITE_URL}/learn/numerology` },
  openGraph: {
    title: `${numerologyData.title} | ${SITE_NAME}`,
    description: numerologyData.description,
    url: `${SITE_URL}/learn/numerology`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${numerologyData.title} | ${SITE_NAME}`,
    description: numerologyData.description,
  },
};

export default function NumerologyLearnPage() {
  return (
    <LearnPage
      data={numerologyData}
      slug="numerology"
      relatedLinks={[
        { title: "Lucky Numbers", href: "/lucky-numbers" },
        { title: "Zodiac Signs Guide", href: "/zodiac/aries" },
        { title: "Fortune Cookie History", href: "/learn/fortune-cookie-history" },
      ]}
    />
  );
}
