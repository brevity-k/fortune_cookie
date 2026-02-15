import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    `Learn about ${SITE_NAME} — the interactive web experience where you break a virtual fortune cookie to reveal your destiny.`,
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: `About ${SITE_NAME}`,
    description:
      `Learn about ${SITE_NAME} — the interactive web experience where you break a virtual fortune cookie to reveal your destiny.`,
    url: `${SITE_URL}/about`,
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${SITE_NAME}`,
    description:
      `Learn about ${SITE_NAME} — the interactive web experience where you break a virtual fortune cookie to reveal your destiny.`,
  },
};

export default function AboutPage() {
  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-golden-shimmer mb-6 text-3xl sm:text-4xl font-bold">About Fortune Cookie</h1>

        <div className="space-y-6 text-foreground/70 leading-relaxed">
          <p>
            Welcome to Fortune Cookie — an interactive web experience that brings the joy of
            cracking open a fortune cookie right to your screen. Using cutting-edge web
            technologies including real-time physics simulation and WebGL rendering, we&apos;ve
            created a digital fortune cookie experience that feels surprisingly tangible.
          </p>

          <h2 className="text-xl font-semibold text-gold">How It Works</h2>
          <p>
            Our fortune cookie uses real 2D physics powered by Matter.js for realistic fragment
            behavior, Pixi.js for smooth 60fps WebGL rendering, and GSAP for polished
            animations. When you break the cookie, each fragment becomes a physics-simulated
            rigid body that bounces, spins, and settles naturally.
          </p>

          <h2 className="text-xl font-semibold text-gold">Five Ways to Break</h2>
          <p>
            We believe in giving you choices. You can click-smash, drag-crack, shake-break,
            double-tap, or squeeze your cookie. Each method produces a different breaking pattern
            and effect, making every experience unique.
          </p>

          <h2 className="text-xl font-semibold text-gold">Our Fortunes</h2>
          <p>
            We&apos;ve curated over 1,000 unique fortune phrases across eight categories: wisdom,
            love, career, humor, motivation, philosophy, adventure, and mystery. Fortunes come
            in four rarity levels — Common, Rare, Epic, and Legendary — with rarer fortunes
            becoming more accessible as you build your daily streak.
          </p>

          <h2 className="text-xl font-semibold text-gold">Daily Fortune</h2>
          <p>
            Every day, a special &quot;Fortune of the Day&quot; is generated using a date-based
            seed, meaning everyone around the world gets the same daily fortune. It&apos;s a fun
            way to connect with friends and share your fortune experience.
          </p>

          <h2 className="text-xl font-semibold text-gold">Built With Love</h2>
          <p>
            Fortune Cookie is built with Next.js, Pixi.js, Matter.js, GSAP, and Tailwind CSS.
            It&apos;s designed to be fast, accessible, and delightful on every device. We hope
            it brings a small moment of joy to your day.
          </p>
        </div>
      </article>
    </div>
  );
}
