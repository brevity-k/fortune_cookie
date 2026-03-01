import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    `Learn about ${SITE_NAME} and the Fortune Crack Editorial Team — astrology, fortune telling, and the interactive experience where you break a virtual fortune cookie to reveal your destiny.`,
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: `About ${SITE_NAME}`,
    description:
      `Learn about ${SITE_NAME} and the Fortune Crack Editorial Team — astrology, fortune telling, and the interactive experience where you break a virtual fortune cookie to reveal your destiny.`,
    url: `${SITE_URL}/about`,
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${SITE_NAME}`,
    description:
      `Learn about ${SITE_NAME} and the Fortune Crack Editorial Team — astrology, fortune telling, and the interactive experience where you break a virtual fortune cookie to reveal your destiny.`,
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

          {/* Editorial Team Section */}
          <h2 className="text-xl font-semibold text-gold">The Fortune Crack Editorial Team</h2>
          <p>
            Behind every fortune, horoscope, and article on Fortune Crack is a dedicated editorial
            team with deep expertise across the domains that make this site possible. We are the
            Fortune Crack Editorial Team — a small group of writers, researchers, and developers
            who share a fascination with how ancient traditions of divination, astrology, and
            fortune telling intersect with modern psychology and technology.
          </p>
          <p>
            Our team brings together four core areas of knowledge:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted">
            <li>
              <strong className="text-foreground/70">Astrology &amp; Divination</strong> — Our
              astrology editors study Western tropical astrology, Chinese zodiac traditions, and
              Vedic astrological systems. They write and review
              our{" "}
              <Link href="/horoscope" className="text-gold hover:underline">
                daily, weekly, and monthly horoscopes
              </Link>{" "}
              for all twelve zodiac signs, ensuring each reading reflects genuine astrological
              principles rather than vague generalities. Their work spans planetary transits, moon
              phases, elemental affinities, and sign compatibility.
            </li>
            <li>
              <strong className="text-foreground/70">Psychology &amp; Wellness</strong> — Fortune
              telling has always been intertwined with human psychology — the Barnum effect, the
              power of positive affirmation, the role of ritual in mental well-being. Our psychology
              contributors ensure that our fortunes and content draw on established principles from
              positive psychology, mindfulness research, and behavioral science. When we say a
              fortune can brighten your day, we mean it in a way that is grounded in how people
              actually process hopeful messages.
            </li>
            <li>
              <strong className="text-foreground/70">Web Technology &amp; Interactive Design</strong>{" "}
              — Fortune Crack is not a static quote generator. Our engineering team builds and
              maintains the physics engine, particle systems, sound design, and animation pipelines
              that make breaking a virtual cookie feel tangible. They also develop the infrastructure
              behind our content automation, SEO optimization, and performance monitoring — the
              invisible work that keeps the site fast, accessible, and discoverable.
            </li>
            <li>
              <strong className="text-foreground/70">Cultural History &amp; Food Studies</strong> —
              Fortune cookies sit at a fascinating crossroads of American, Japanese, and Chinese
              culinary history. Our cultural contributors research the origins of fortune-telling
              traditions, the migration of food customs across continents, and the stories behind
              lucky charms and superstitions worldwide. Their research informs our{" "}
              <Link href="/blog" className="text-gold hover:underline">
                blog articles
              </Link>{" "}
              and ensures our content respects and accurately represents the traditions we draw from.
            </li>
          </ul>
          <p>
            Every piece of content published on Fortune Crack — whether it is a two-sentence
            fortune, a 1,500-word blog post, or a daily horoscope — passes through our editorial
            review process. We use a combination of human judgment and AI-assisted quality checks
            to maintain consistency, accuracy, and readability across more than 1,000 fortunes and
            dozens of articles. You can read more about how we create, review, and publish content
            in our{" "}
            <Link href="/editorial-policy" className="text-gold hover:underline">
              Editorial Policy
            </Link>
            .
          </p>

          {/* Our Approach to Astrology Section */}
          <h2 className="text-xl font-semibold text-gold">Our Approach to Astrology</h2>
          <p>
            Astrology occupies a unique space in human culture. It is not a predictive science in
            the empirical sense, and we do not present it as one. Instead, we approach astrology
            as what it has been for thousands of years: a rich symbolic language that helps people
            reflect on their personalities, relationships, and life patterns. The value of a
            horoscope is not in foretelling specific events — it is in prompting self-reflection
            and offering a framework for thinking about the rhythms of daily life.
          </p>
          <p>
            Our editorial philosophy rests on three principles:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted">
            <li>
              <strong className="text-foreground/70">Cultural respect over sensationalism</strong>{" "}
              — We draw on Western tropical astrology, Chinese zodiac traditions, and Vedic
              astrological systems with equal respect. Rather than reducing these traditions to
              clickbait personality quizzes, we present their insights in context. When we describe
              a Mercury retrograde or a lunar phase, we explain what the tradition actually teaches,
              not just what generates clicks.
            </li>
            <li>
              <strong className="text-foreground/70">Psychological grounding</strong> — Where
              possible, we connect astrological themes to established psychological concepts.
              The reason horoscopes resonate with millions of people is not magic — it is the
              Barnum effect, confirmation bias, and the genuine human need for narrative and meaning.
              We find this psychological dimension fascinating, not dismissive. Understanding
              <em> why</em> a fortune feels personal makes the experience richer, not shallower.
            </li>
            <li>
              <strong className="text-foreground/70">Research-backed content</strong> — Our
              horoscopes and astrology articles are written by editors who study primary sources:
              classical astrological texts, peer-reviewed psychology papers on belief and
              well-being, and cultural histories of divination practices. We cite traditions
              accurately, distinguish between different astrological systems, and never fabricate
              planetary positions or celestial events. When we reference a transit or alignment,
              it corresponds to actual astronomical data.
            </li>
          </ul>
          <p>
            We believe that fortune cookies, horoscopes, and tarot readings can coexist with
            scientific literacy. You do not have to believe in destiny to enjoy cracking a cookie
            and reading a message that makes you pause and think. That pause — that small moment
            of reflection — is real, and it is what we design for. Whether you visit Fortune Crack
            for your{" "}
            <Link href="/horoscope" className="text-gold hover:underline">
              daily horoscope
            </Link>
            , to explore our{" "}
            <Link href="/blog" className="text-gold hover:underline">
              articles on luck, culture, and astrology
            </Link>
            , or simply to{" "}
            <Link href="/" className="text-gold hover:underline">
              break a fortune cookie
            </Link>{" "}
            and see what the universe has to say, we are glad you are here.
          </p>
        </div>
      </article>
    </div>
  );
}
