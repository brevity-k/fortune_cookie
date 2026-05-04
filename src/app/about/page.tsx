import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    `Learn about ${SITE_NAME} — an interactive fortune cookie experience with real-time physics, five breaking styles, and over 1,000 original fortunes.`,
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: `About ${SITE_NAME}`,
    description:
      `Learn about ${SITE_NAME} — an interactive fortune cookie experience with real-time physics, five breaking styles, and over 1,000 original fortunes.`,
    url: `${SITE_URL}/about`,
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${SITE_NAME}`,
    description:
      `Learn about ${SITE_NAME} — an interactive fortune cookie experience with real-time physics, five breaking styles, and over 1,000 original fortunes.`,
  },
};

export default function AboutPage() {
  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-golden-shimmer mb-6 text-3xl sm:text-4xl font-bold">
          About Fortune Crack
        </h1>

        <div className="space-y-6 text-foreground/80 leading-relaxed">
          <p>
            Fortune Crack is an interactive fortune cookie experience at{" "}
            <Link href="/" className="text-gold hover:underline">
              fortunecrack.com
            </Link>
            . The site combines a physics-based cookie-breaking game with a growing library of
            original fortunes, daily horoscopes for all twelve zodiac signs, zodiac profiles, and
            articles on luck, astrology, and cultural traditions.
          </p>

          <h2 className="text-xl font-semibold text-gold">What You&apos;ll Find Here</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground/70">
            <li>
              <strong>Interactive Fortune Cookie</strong> — physics-based breaking with five
              distinct methods, powered by Matter.js rigid-body dynamics and Pixi.js WebGL
              rendering
            </li>
            <li>
              <strong>1,000+ Original Fortunes</strong> — 8 categories (wisdom, love, career,
              humor, motivation, philosophy, adventure, mystery) across 4 rarity tiers (Common,
              Rare, Epic, Legendary)
            </li>
            <li>
              <strong>Daily Horoscopes</strong> — readings for all 12 zodiac signs, updated every
              morning based on traditional Western astrology principles
            </li>
            <li>
              <strong>Weekly &amp; Monthly Forecasts</strong> — extended outlooks for each sign,
              refreshed on a regular schedule
            </li>
            <li>
              <strong>Zodiac Profiles</strong> — per-sign fortune pages with category breakdowns
            </li>
            <li>
              <strong>Lucky Numbers</strong> — date-seeded daily lucky numbers so everyone sees the
              same set on a given day
            </li>
            <li>
              <strong>Blog</strong> — articles covering fortune cookie history, astrology, the
              psychology of luck, and cultural traditions around the world
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-gold">How It Works</h2>
          <p>
            The cookie-breaking interaction runs on real-time 2D physics. Matter.js handles
            rigid-body dynamics so each fragment cracks, bounces, and settles based on the force
            applied. Pixi.js renders everything through WebGL for smooth animation at high frame
            rates. Breaking a cookie also triggers crack sounds, a particle effect burst, and a
            typewriter-style reveal of your fortune.
          </p>
          <p>
            Five breaking methods are available: triple-tap smash, drag-to-throw, shake,
            double-tap dramatic crack, and press-and-hold squeeze. Each produces a different
            breaking pattern.
          </p>
          <p>
            The Daily Fortune uses a date-seeded random number generator (mulberry32 algorithm), so
            every visitor on the same calendar day sees the same fortune globally. The daily streak
            system tracks consecutive visits and adjusts the rarity distribution in your favor as
            your streak grows.
          </p>

          <h2 className="text-xl font-semibold text-gold">Our Approach</h2>
          <p>
            Horoscopes are generated daily based on traditional Western astrology principles:
            planetary rulers, elemental associations (fire, earth, air, water), and the established
            characteristics of each sign. They are produced on a fixed schedule — daily horoscopes
            update each morning, weekly forecasts update each week, and monthly outlooks update at
            the start of each month.
          </p>
          <p>
            The fortune collection spans 8 categories and grows on a weekly basis. Blog content
            covers a range of topics — from the{" "}
            <Link href="/blog/history-of-fortune-cookies" className="text-gold hover:underline">
              history of fortune cookies
            </Link>{" "}
            to the{" "}
            <Link
              href="/blog/psychology-of-fortune-telling"
              className="text-gold hover:underline"
            >
              psychology of fortune telling
            </Link>
            . All content on the site is updated on a regular, documented schedule.
          </p>

          <h2 className="text-xl font-semibold text-gold">Why We Built This</h2>
          <p>
            Most fortune cookie sites are an afterthought &mdash; a single button that picks a
            random message from a short list. We wanted something different: a small, honest
            corner of the web that takes the fortune cookie format seriously as a vehicle for
            brief reflection. The cookie-breaking interaction was built from scratch with
            real-time physics because clicking a button felt like cheating; the suspense of
            actually cracking the cookie matters. The fortune library was hand-curated and is
            grown weekly, with rarity tiers so the experience rewards return visits without
            requiring an account, login, or payment.
          </p>
          <p>
            The site is run by a single independent developer based in South Korea. Beyond the
            interactive cookie, the site grew over time to include daily horoscopes, zodiac
            profiles, lucky numbers, a Korean Saju (Four Pillars of Destiny) calculator, and a
            blog covering the cultural history and psychology behind fortune-telling traditions
            worldwide. Everything is free, ad-supported, and built with no tracking beyond what
            is required to run the ads themselves.
          </p>

          <h2 className="text-xl font-semibold text-gold">Editorial Standards</h2>
          <p>
            We treat fortune cookies and horoscopes as entertainment and gentle prompts for
            self-reflection &mdash; not predictive science. Nothing on this site should be taken
            as professional medical, financial, or psychological advice. With that boundary
            clearly drawn, we still hold ourselves to several standards:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground/70">
            <li>
              <strong>Original content.</strong> Our fortunes, horoscopes, zodiac descriptions,
              and articles are written for this site. We do not scrape or repackage content
              from other sources.
            </li>
            <li>
              <strong>Cited history.</strong> Claims about the history of fortune cookies, the
              origins of astrological systems, or the development of Korean Saju are checked
              against primary sources or peer-reviewed scholarship before publication. When we
              describe research findings (for example, the Barnum effect or implementation
              intentions), we name the underlying study or theorist so readers can verify.
            </li>
            <li>
              <strong>AI assistance, disclosed.</strong> Some of our daily and weekly horoscope
              text is drafted with AI assistance and reviewed before publication. Our
              hand-curated fortune library, the cookie-breaking game, the Saju calculation
              engine, and the long-form articles in our blog are written and reviewed
              manually. See our{" "}
              <Link href="/editorial-policy" className="text-gold hover:underline">
                Content Policy
              </Link>{" "}
              for the full breakdown of what is hand-written, what is AI-assisted, and what is
              algorithmically generated.
            </li>
            <li>
              <strong>Corrections.</strong> When we get something wrong, we fix it. If you spot
              a factual error or a broken link, please tell us through the{" "}
              <Link href="/contact" className="text-gold hover:underline">
                contact page
              </Link>
              .
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-gold">Privacy and Advertising</h2>
          <p>
            Fortune Crack is supported by display advertising. We do not sell user data, we do
            not require an account, and we do not run paid placements inside fortunes,
            horoscopes, or articles &mdash; advertising is always clearly separated from
            content. Read our{" "}
            <Link href="/privacy" className="text-gold hover:underline">
              privacy policy
            </Link>{" "}
            for the full details on what is and is not collected.
          </p>

          <h2 className="text-xl font-semibold text-gold">Get in Touch</h2>
          <p>
            Questions, feedback, corrections, or just want to say hello? Visit the{" "}
            <Link href="/contact" className="text-gold hover:underline">
              contact page
            </Link>{" "}
            and send a message. Every message is read.
          </p>
        </div>
      </article>
    </div>
  );
}
