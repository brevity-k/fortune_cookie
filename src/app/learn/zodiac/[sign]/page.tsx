import type { Metadata } from "next";
import LearnPage from "@/components/LearnPage";
import { zodiacProfiles } from "@/data/learn/zodiac-profiles";
import { ZODIAC_SIGNS } from "@/lib/horoscopes";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const dynamicParams = false;

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((s) => ({ sign: s.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sign: string }>;
}): Promise<Metadata> {
  const { sign } = await params;
  const profile = zodiacProfiles[sign];
  if (!profile) return { title: "Sign not found" };

  return {
    title: profile.title,
    description: profile.description,
    keywords: profile.keywords,
    alternates: { canonical: `${SITE_URL}/learn/zodiac/${sign}` },
    openGraph: {
      title: `${profile.title} | ${SITE_NAME}`,
      description: profile.description,
      url: `${SITE_URL}/learn/zodiac/${sign}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.title} | ${SITE_NAME}`,
      description: profile.description,
    },
  };
}

export default async function ZodiacLearnPage({
  params,
}: {
  params: Promise<{ sign: string }>;
}) {
  const { sign } = await params;
  const profile = zodiacProfiles[sign];

  if (!profile) {
    return (
      <div className="bg-warm-gradient min-h-screen px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground/80">Sign not found</h1>
      </div>
    );
  }

  const signInfo = ZODIAC_SIGNS.find((s) => s.key === sign);

  return (
    <LearnPage
      data={profile}
      slug={`zodiac/${sign}`}
      relatedLinks={[
        { title: `${signInfo?.name || sign} Daily Horoscope`, href: `/horoscope/daily/${sign}` },
        { title: `${signInfo?.name || sign} Fortunes`, href: `/zodiac/${sign}` },
        { title: "All Zodiac Signs", href: "/learn/zodiac-signs" },
        { title: "The Four Elements", href: "/learn/elements" },
      ]}
    />
  );
}
