import type { Metadata } from "next";
import LearnPage from "@/components/LearnPage";
import { fortuneCookieHistoryData } from "@/data/learn/fortune-cookie-history";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: fortuneCookieHistoryData.title,
  description: fortuneCookieHistoryData.description,
  keywords: fortuneCookieHistoryData.keywords,
  alternates: { canonical: `${SITE_URL}/learn/fortune-cookie-history` },
  openGraph: {
    title: `${fortuneCookieHistoryData.title} | ${SITE_NAME}`,
    description: fortuneCookieHistoryData.description,
    url: `${SITE_URL}/learn/fortune-cookie-history`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${fortuneCookieHistoryData.title} | ${SITE_NAME}`,
    description: fortuneCookieHistoryData.description,
  },
};

export default function FortuneCookieHistoryLearnPage() {
  return (
    <LearnPage
      data={fortuneCookieHistoryData}
      slug="fortune-cookie-history"
      relatedLinks={[
        { title: "About Fortune Cookie", href: "/about" },
        { title: "Zodiac Signs Guide", href: "/zodiac/aries" },
        { title: "Blog", href: "/blog" },
      ]}
    />
  );
}
