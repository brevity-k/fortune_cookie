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
        <h1 className="text-golden-shimmer mb-6 text-3xl sm:text-4xl font-bold">
          About Fortune Crack
        </h1>

        <div className="space-y-6 text-foreground/80 leading-relaxed">
          <p>
            Fortune Crack started with a simple question: why do fortune cookie websites feel so
            lifeless? A real fortune cookie is a tiny event — you hold it, crack it, hear the snap,
            and pull out a slip of paper with your fate scribbled on it. That moment of anticipation
            and surprise is the whole point. We wanted to bring that feeling to the screen.
          </p>

          <p>
            So we built something different. Fortune Crack uses real-time 2D physics powered by
            Matter.js, WebGL rendering through Pixi.js, and cinematic animations with GSAP to
            create a fortune cookie you can actually <em>break</em>. Every fragment is a physics
            object that cracks, bounces, and tumbles. The sound of the break, the shower of
            particles, the slow typewriter reveal of your fortune — these details matter because
            they turn a click into an experience.
          </p>

          <h2 className="text-xl font-semibold text-gold">More Than Random Quotes</h2>
          <p>
            We did not want to serve recycled inspirational quotes from a database. Fortune Crack
            features over 1,000 original fortunes across eight carefully chosen categories: wisdom,
            love, career, humor, motivation, philosophy, adventure, and mystery. Each fortune
            carries a rarity level — Common, Rare, Epic, or Legendary — and your daily streak
            improves your odds of discovering the rarest ones. It is a small game layered on top of
            a simple ritual, and it gives you a reason to come back every day.
          </p>

          <h2 className="text-xl font-semibold text-gold">Five Ways to Break</h2>
          <p>
            We believe in giving you choices. Tap three times for a quick smash. Drag your finger
            across the cookie to throw it. Shake your mouse — or your phone — to rattle it apart.
            Double-tap for a two-stage dramatic crack, or press and hold to squeeze it open slowly.
            Each method triggers a different breaking pattern, so the experience changes every time.
          </p>

          <h2 className="text-xl font-semibold text-gold">A Shared Daily Moment</h2>
          <p>
            Every day, Fortune Crack selects one fortune for the entire world. Using a date-based
            seed, everyone who visits sees the same Daily Fortune — a shared slice of serendipity.
            Friends compare their fortunes on social media. Couples check together over morning
            coffee. It is a small thing, but small things are what fortune cookies are all about.
          </p>

          <h2 className="text-xl font-semibold text-gold">Built for Delight</h2>
          <p>
            Fortune Crack is built with Next.js for speed, Tailwind CSS for clean design, and a
            physics engine that runs at 60 frames per second on every device. We obsess over the
            details — from the exact pitch of the crack sound to the way a fortune fades in letter
            by letter — because we think the internet could use more things that bring people a
            small, unexpected moment of joy.
          </p>
        </div>
      </article>
    </div>
  );
}
