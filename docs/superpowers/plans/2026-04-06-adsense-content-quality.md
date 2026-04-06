# AdSense Content Quality Improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix Google AdSense "low value content" rejection by adding E-E-A-T signals, differentiating templated pages, adding crawlable homepage text, and humanizing auto-generated content prompts.

**Architecture:** Content-only changes across 7 existing files. No new files, no new dependencies, no schema changes. All changes are static text/JSX additions or prompt string modifications.

**Tech Stack:** Next.js (existing pages), TypeScript, Claude API prompts

---

## File Map

| File | Action | Task |
|------|--------|------|
| `src/app/about/page.tsx` | Rewrite content | 1 |
| `src/app/blog/[slug]/page.tsx` | Add author section | 2 |
| `src/app/page.tsx` | Add content section + citations | 3 |
| `src/app/zodiac/[sign]/page.tsx` | Add unique narratives + vary FAQs | 4 |
| `src/app/horoscope/daily/[sign]/page.tsx` | Add attribution + context + vary FAQs | 5 |
| `scripts/generate-horoscopes.ts` | Update prompts | 6 |
| `scripts/generate-post.ts` | Update prompts | 7 |

---

### Task 1: Rewrite About Page with Honest E-E-A-T Signals

**Files:**
- Modify: `src/app/about/page.tsx`

- [ ] **Step 1: Rewrite the about page content**

Replace the entire `AboutPage` component body (lines 26-118) with a mission-and-product focused page. Keep the existing metadata (lines 1-24) unchanged.

```tsx
export default function AboutPage() {
  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-golden-shimmer mb-6 text-3xl sm:text-4xl font-bold">
          About Fortune Crack
        </h1>

        <div className="space-y-6 text-foreground/80 leading-relaxed">
          <p>
            Fortune Crack is a daily fortune and astrology destination where you can crack open a
            virtual fortune cookie, read your horoscope, and explore zodiac insights — all in one
            place. The site is updated every day with fresh content.
          </p>

          <h2 className="text-xl font-semibold text-gold">What You&apos;ll Find Here</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground/70">
            <li>
              <strong>Interactive Fortune Cookie</strong> — a physics-based cookie you can break
              five different ways (tap, drag, shake, double-tap, squeeze), powered by Matter.js and
              Pixi.js
            </li>
            <li>
              <strong>1,000+ Original Fortunes</strong> — across eight categories (wisdom, love,
              career, humor, motivation, philosophy, adventure, mystery) with four rarity tiers
            </li>
            <li>
              <strong>Daily Horoscopes</strong> — freshly generated readings for all 12 zodiac
              signs, updated every morning
            </li>
            <li>
              <strong>Weekly &amp; Monthly Forecasts</strong> — longer-range horoscopes updated on
              their respective schedules
            </li>
            <li>
              <strong>Zodiac Profiles</strong> — in-depth personality, relationship, and career
              insights for each sign
            </li>
            <li>
              <strong>Lucky Numbers</strong> — daily number sets generated with a date-seeded
              algorithm so everyone sees the same numbers each day
            </li>
            <li>
              <strong>Blog</strong> — articles on fortune cookie history, astrology, luck,
              psychology, and cultural traditions
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-gold">How It Works</h2>
          <p>
            The fortune cookie experience uses real-time 2D physics. Every cookie shatters into
            fragments driven by Matter.js rigid-body dynamics and rendered through Pixi.js WebGL.
            Crack sounds, particle effects, and a typewriter fortune reveal are timed to each
            breaking method. A daily streak system tracks consecutive visits and improves your
            chances of finding rarer fortunes.
          </p>
          <p>
            The Daily Fortune uses a date-seeded random number generator, so everyone on Earth sees
            the same fortune each day. It changes at midnight in your local time zone.
          </p>

          <h2 className="text-xl font-semibold text-gold">Our Approach</h2>
          <p>
            Horoscopes are generated daily based on traditional Western astrology principles —
            planetary rulers, elemental associations, and sign characteristics. The fortune
            collection spans eight categories and grows weekly with new additions. Blog content
            covers topics from the{" "}
            <Link href="/blog/history-of-fortune-cookies" className="text-gold hover:underline">
              history of fortune cookies
            </Link>{" "}
            to the{" "}
            <Link href="/blog/psychology-of-fortune-telling" className="text-gold hover:underline">
              psychology behind fortune-telling
            </Link>
            .
          </p>
          <p>
            All content on Fortune Crack is updated on a regular schedule: daily horoscopes every
            morning, new fortunes weekly, and blog posts multiple times a week.
          </p>

          <h2 className="text-xl font-semibold text-gold">Get in Touch</h2>
          <p>
            Have a question, suggestion, or just want to say hello? Reach out through our{" "}
            <Link href="/contact" className="text-gold hover:underline">
              contact page
            </Link>
            .
          </p>
        </div>
      </article>
    </div>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run build 2>&1 | grep -E "(error|Error|about)" | head -20`
Expected: No errors related to the about page.

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "content: rewrite about page with factual E-E-A-T signals"
```

---

### Task 2: Add Author Section to Blog Posts

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx` (lines 119-124)

- [ ] **Step 1: Add "About Fortune Crack" section after MDX content**

Replace the existing footer section (lines 120-124):

```tsx
        <div className="mt-12 border-t border-border pt-8">
          <Link href="/blog" className="text-gold transition hover:text-gold-light">
            ← Read more articles
          </Link>
        </div>
```

With:

```tsx
        <div className="mt-12 border-t border-border pt-8">
          <div className="rounded-xl border border-border bg-background p-5 mb-6">
            <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">
              About Fortune Crack
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Fortune Crack is a daily fortune and astrology destination featuring 1,000+ original
              fortunes, daily horoscopes for all 12 zodiac signs, and in-depth zodiac insights.
              Content is updated every day.{" "}
              <Link href="/about" className="text-gold hover:underline">
                Learn more about us
              </Link>
            </p>
          </div>
          <Link href="/blog" className="text-gold transition hover:text-gold-light">
            ← Read more articles
          </Link>
        </div>
```

- [ ] **Step 2: Verify the build**

Run: `npm run build 2>&1 | grep -E "(error|Error)" | head -10`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/blog/\[slug\]/page.tsx
git commit -m "content: add About Fortune Crack section to blog posts"
```

---

### Task 3: Add Crawlable Content Section + Citations to Homepage

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add "What Is Fortune Crack?" section**

Insert a new section after the "Latest Articles" section (after line 295, before line 298 "About Fortune Cookies" comment). Add this between the articles and the existing "Story Behind the Cookie":

```tsx
      {/* What Is Fortune Crack */}
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-2xl font-bold text-foreground/80 mb-4 text-center">
          What Is Fortune Crack?
        </h2>
        <div className="rounded-2xl border border-border bg-background p-8 space-y-4">
          <p className="leading-relaxed text-muted">
            Fortune Crack is a free daily fortune and astrology site built around an interactive
            fortune cookie experience. Instead of clicking a button to see a random quote, you
            actually break a virtual cookie using real-time physics — tap it, drag it, shake your
            device, double-tap, or squeeze. Each method produces different crack patterns, sounds,
            and particle effects.
          </p>
          <p className="leading-relaxed text-muted">
            Behind the cookie is a collection of over 1,000 original fortunes organized into eight
            categories: wisdom, love, career, humor, motivation, philosophy, adventure, and mystery.
            Each fortune has a rarity tier (Common, Rare, Epic, or Legendary), and a daily streak
            system rewards regular visitors with better odds of finding rare fortunes.
          </p>
          <p className="leading-relaxed text-muted">
            Beyond fortune cookies, the site offers{" "}
            <Link href="/horoscope" className="text-gold hover:underline">daily horoscopes</Link>{" "}
            for all 12 zodiac signs, updated every morning based on traditional Western astrology.
            There are also{" "}
            <Link href="/zodiac/aries" className="text-gold hover:underline">zodiac profiles</Link>{" "}
            with personality insights and relationship guidance,{" "}
            <Link href="/lucky-numbers" className="text-gold hover:underline">daily lucky numbers</Link>,
            and a{" "}
            <Link href="/blog" className="text-gold hover:underline">blog</Link>{" "}
            covering fortune cookie history, astrology, luck, and cultural traditions.
          </p>
          <p className="leading-relaxed text-muted">
            The Daily Fortune uses a date-seeded algorithm so everyone on Earth sees the same fortune
            each day. Horoscopes are regenerated daily. New fortunes are added weekly. Blog posts
            publish multiple times a week.
          </p>
        </div>
      </section>
```

- [ ] **Step 2: Add citations to "Story Behind the Cookie" section**

In the existing Story section (lines 298-337), replace the two content paragraphs with versions that include citation links. Replace lines 304-320:

Old text (lines 304-319):
```tsx
          <p className="leading-relaxed text-muted">
            Despite being synonymous with Chinese restaurants in America, fortune cookies were
            actually invented in California. Japanese immigrant Makoto Hagiwara is widely credited
            with introducing them at San Francisco&apos;s Japanese Tea Garden in the early 1900s. The
            cookies drew from the Japanese tradition of <em>tsujiura senbei</em> — crackers containing
            paper fortunes sold at temples in Kyoto. During World War II, Japanese-American bakers
            were interned, and Chinese-American manufacturers took over production, cementing the
            cookie&apos;s association with Chinese cuisine.
          </p>
          <p className="leading-relaxed text-muted">
            Psychologists call it the <em>Barnum effect</em> — our tendency to find personal meaning
            in vague statements. Fortune cookies tap into this beautifully. A message like &ldquo;A
            calm mind hears what a busy mind cannot&rdquo; feels uncannily relevant because our brains
            naturally search for connections to our current circumstances. This isn&apos;t a flaw in
            thinking — it&apos;s a feature. Studies show that brief moments of reflection, even prompted
            by a cookie, can improve mood and encourage mindful pauses in our day.
          </p>
```

New text:
```tsx
          <p className="leading-relaxed text-muted">
            Despite being synonymous with Chinese restaurants in America, fortune cookies were
            actually invented in California. Japanese immigrant{" "}
            <a href="https://en.wikipedia.org/wiki/Makoto_Hagiwara" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
              Makoto Hagiwara
            </a>{" "}
            is widely credited with introducing them at San Francisco&apos;s{" "}
            <a href="https://en.wikipedia.org/wiki/Japanese_Tea_Garden_(San_Francisco)" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
              Japanese Tea Garden
            </a>{" "}
            in the early 1900s. The cookies drew from the Japanese tradition of{" "}
            <em>tsujiura senbei</em> — crackers containing paper fortunes sold at temples in Kyoto.
            During World War II, Japanese-American bakers were interned, and Chinese-American
            manufacturers took over production, cementing the cookie&apos;s association with Chinese
            cuisine.
          </p>
          <p className="leading-relaxed text-muted">
            Psychologists call it the{" "}
            <a href="https://en.wikipedia.org/wiki/Barnum_effect" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
              Barnum effect
            </a>{" "}
            — our tendency to find personal meaning in vague statements. Fortune cookies tap into
            this beautifully. A message like &ldquo;A calm mind hears what a busy mind cannot&rdquo;
            feels uncannily relevant because our brains naturally search for connections to our
            current circumstances. This isn&apos;t a flaw in thinking — it&apos;s a feature. Brief moments
            of reflection, even prompted by a cookie, can improve mood and encourage mindful pauses
            in our day.
          </p>
```

- [ ] **Step 3: Verify the build**

Run: `npm run build 2>&1 | grep -E "(error|Error)" | head -10`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "content: add 'What Is Fortune Crack' section + citations to homepage"
```

---

### Task 4: Differentiate Zodiac Pages with Unique Narratives + Varied FAQs

**Files:**
- Modify: `src/app/zodiac/[sign]/page.tsx`

- [ ] **Step 1: Add SIGN_NARRATIVES data object**

Insert after the `SIGN_PROFILES` object (find the closing `};` of SIGN_PROFILES) and before the `export default` function. Each narrative uses a different angle, tone, and length to break the template pattern:

```tsx
const SIGN_NARRATIVES: Record<string, string> = {
  aries: "If you have ever watched someone leap before looking and somehow land perfectly, you have probably witnessed an Aries in their element. This is the sign that trusts momentum over planning, and more often than not, the gamble pays off. Their fortune cookie fortunes tend to hit hardest when they are about action — not because Aries needs encouragement to act, but because seeing their instinct validated in writing gives them a rare moment of pause to appreciate what they already know.",
  taurus: "There is a specific kind of calm that Taurus carries. It is not the calm of someone who has never faced difficulty but of someone who has decided, quietly and firmly, that they will not be moved by it. Taurus reads fortune cookies the way they approach most things: slowly, savoring the moment, turning the words over before deciding what to keep. The fortunes that stick with them are the ones about patience and lasting value — the ones that confirm what the Bull has always suspected about how the world really works.",
  gemini: "Gemini reads a fortune cookie and immediately thinks of three different interpretations, two counterarguments, and a story it reminds them of. This is not indecision. It is a mind that refuses to accept the first answer when there might be a better one underneath. The fortunes that land for Gemini are the ones with a twist — the ones that seem to say one thing but reveal something deeper on a second read.",
  cancer: "Cancer does not just read a fortune — they feel it. The words on that little slip of paper have a way of finding the exact tender spot that Cancer was trying not to think about. This is a sign that processes the world through emotion first and logic second, and the fortunes that move them most are the ones about home, belonging, and the quiet courage it takes to let people in.",
  leo: "Leo opens a fortune cookie the way they do everything else: with flair. They read it aloud to the table, gauge the reaction, and then decide whether to frame it or forget it. But beneath the performance is a sign that genuinely wants their fortune to mean something. The messages that stay with Leo are the ones about generosity and creative courage — reminders that their light is not just for show but for warming everyone around them.",
  virgo: "Virgo reads a fortune cookie and immediately evaluates whether it is grammatically correct, factually plausible, and relevant to their current situation. This is not cynicism — it is care. Virgo takes words seriously because they understand that language shapes thought. The fortunes that break through their analytical filter are the precise ones, the ones that name something specific rather than offering vague encouragement.",
  libra: "Libra holds the fortune slip between their fingers and weighs it, almost literally, against what they already believe. This sign is always calibrating — not because they lack conviction but because they want their convictions to be fair. Fortune cookies work for Libra when they offer a nudge toward a decision the Scales have been quietly circling for weeks.",
  scorpio: "Scorpio does not trust fortune cookies. They do not trust anything that offers easy answers. But every once in a while, a fortune lands with the precision of a scalpel, cutting straight to something Scorpio has been carrying alone. Those are the ones they fold up and slip into their wallet without telling anyone. Scorpio's relationship with fortune is intensely private — they do not share what resonates because sharing would dilute its power.",
  sagittarius: "Sagittarius treats fortune cookies the way they treat most of life: as a game with real stakes and no guaranteed rules. They crack the cookie fast, read the fortune faster, and are already planning how to test it before the crumbs hit the table. The fortunes that excite Sagittarius are the ones that point somewhere — toward a trip, an idea, a question worth chasing across three continents.",
  capricorn: "Capricorn reads a fortune cookie and files it under 'possibly useful, pending verification.' This is a sign that has learned not to trust easy promises because the things they value most — achievement, respect, lasting security — are earned through effort, not luck. The fortunes that Capricorn quietly respects are the ones about discipline and long games, the ones that treat success as something built rather than bestowed.",
  aquarius: "Aquarius reads a fortune cookie and wonders who wrote it, what algorithm selected it, and whether the entire fortune cookie industry is an underappreciated sociological experiment. They are not being difficult — they are being Aquarius. The fortunes that actually land for this sign are the ones about collective good and unconventional thinking, the ones that validate their suspicion that the world needs different answers than the ones it has been settling for.",
  pisces: "Pisces does not read a fortune cookie so much as absorb it. The words sink in slowly, mixing with whatever Pisces was already feeling, and by the time the fortune has settled, it has become something larger and more personal than what was actually printed on the paper. This is the sign that finds meaning everywhere, and fortune cookies are just one more channel through which the universe sends its quiet messages.",
};
```

- [ ] **Step 2: Add SIGN_FAQS data with genuinely different questions per sign**

Insert after `SIGN_NARRATIVES`:

```tsx
const SIGN_FAQS: Record<string, { q: string; a: string }[]> = {
  aries: [
    { q: "Why are Aries fortunes focused on action and initiative?", a: "Aries is ruled by Mars, the planet of drive and physical energy. Fortunes drawn from the motivation category align with this cardinal fire sign's natural impulse to lead and start new things." },
    { q: "What time of year is Aries season?", a: "Aries season runs from March 21 to April 19, marking the beginning of the astrological year and the spring equinox in the Northern Hemisphere." },
  ],
  taurus: [
    { q: "Why does Taurus get career-themed fortunes?", a: "Taurus is an earth sign ruled by Venus, connecting material comfort with aesthetic appreciation. Career fortunes reflect Taurus's practical nature and talent for building lasting value." },
    { q: "What makes Taurus compatible with other earth signs?", a: "Earth signs (Taurus, Virgo, Capricorn) share a grounded, practical approach to life. They understand each other's need for stability, routine, and tangible results." },
  ],
  gemini: [
    { q: "Why are Gemini fortunes drawn from philosophy?", a: "Gemini is an air sign ruled by Mercury, the planet of communication and intellect. Philosophy fortunes match Gemini's love of ideas, mental exploration, and seeing things from multiple angles." },
    { q: "Is it true that Geminis are two-faced?", a: "This is a common misconception. Gemini's dual nature (symbolized by the Twins) represents mental versatility — the ability to hold multiple perspectives simultaneously, not insincerity." },
  ],
  cancer: [
    { q: "Why are Cancer fortunes connected to love?", a: "Cancer is a water sign ruled by the Moon, governing emotions, intuition, and nurturing. Love fortunes resonate with Cancer's deep emotional intelligence and devotion to the people they care about." },
    { q: "How does the Moon affect Cancer's daily fortune?", a: "The Moon changes signs every 2-3 days, making Cancer more emotionally dynamic than other signs. Daily fortunes can feel especially relevant because Cancer's mood shifts naturally align with lunar cycles." },
  ],
  leo: [
    { q: "What kind of fortunes resonate most with Leo?", a: "Leo is ruled by the Sun and drawn to fortunes about creativity, leadership, and generosity. As a fire sign, motivation-category fortunes match Leo's natural desire to inspire and be recognized." },
    { q: "Why is Leo associated with creativity?", a: "The Sun, Leo's ruling planet, represents self-expression and vitality. Leo governs the fifth house of creativity, romance, and joy — making creative pursuits central to the Lion's identity." },
  ],
  virgo: [
    { q: "Why does Virgo get career fortunes like Taurus?", a: "Both are earth signs, but for different reasons. Virgo's Mercury rulership channels earth energy toward analytical work, systems improvement, and practical service. Career fortunes align with Virgo's focus on meaningful, detail-oriented work." },
    { q: "Is Virgo really the most health-conscious sign?", a: "Virgo rules the sixth house of health and daily routines. This sign has a natural awareness of how habits, diet, and environment affect wellbeing — making them genuinely attuned to health-related guidance." },
  ],
  libra: [
    { q: "Why are Libra fortunes philosophical?", a: "Libra is an air sign ruled by Venus, combining intellectual curiosity with a deep concern for fairness and beauty. Philosophy fortunes match Libra's natural tendency to weigh ideas and seek balance between opposing viewpoints." },
    { q: "How does Venus influence Libra differently than Taurus?", a: "Venus expresses through Taurus as physical sensuality and material comfort. Through Libra, Venus manifests as aesthetic harmony, social grace, and the pursuit of balanced relationships." },
  ],
  scorpio: [
    { q: "Why are Scorpio fortunes about love rather than mystery?", a: "Scorpio is a water sign, and despite its intense reputation, its core drive is deep emotional connection. Love fortunes speak to Scorpio's capacity for transformative intimacy and fierce loyalty." },
    { q: "What role does Pluto play in Scorpio's fortune?", a: "Pluto, Scorpio's modern ruler, governs transformation, hidden depths, and regeneration. Scorpio's fortunes often carry an extra layer of meaning — what appears on the surface is rarely the full story." },
  ],
  sagittarius: [
    { q: "Why does Sagittarius get motivation-themed fortunes?", a: "Sagittarius is a fire sign ruled by Jupiter, the planet of expansion and optimism. Motivation fortunes align with the Archer's natural enthusiasm, love of adventure, and belief that the best is yet to come." },
    { q: "What makes Sagittarius the traveler of the zodiac?", a: "Jupiter's influence gives Sagittarius an insatiable curiosity about the world. The ninth house, which Sagittarius rules, governs long-distance travel, higher education, and cross-cultural understanding." },
  ],
  capricorn: [
    { q: "How do career fortunes align with Capricorn's nature?", a: "Capricorn is ruled by Saturn, the planet of discipline and long-term achievement. As an earth sign ruling the tenth house of career and public life, professional fortunes speak directly to Capricorn's core ambitions." },
    { q: "Why is Capricorn considered the most ambitious sign?", a: "Saturn's influence gives Capricorn a natural understanding of delayed gratification. They are willing to put in years of steady effort for goals that other signs would abandon, making their ambition uniquely persistent." },
  ],
  aquarius: [
    { q: "Why does Aquarius receive philosophy fortunes?", a: "Aquarius is an air sign co-ruled by Saturn and Uranus, combining structured thinking with revolutionary ideas. Philosophy fortunes match Aquarius's drive to question assumptions and envision better systems." },
    { q: "Is Aquarius really the most independent sign?", a: "Uranus, Aquarius's modern ruler, governs freedom and unconventional thinking. Aquarians value intellectual autonomy and often prefer to chart their own course rather than follow established paths." },
  ],
  pisces: [
    { q: "Why are Pisces fortunes connected to love?", a: "Pisces is a water sign co-ruled by Jupiter and Neptune, governing compassion, intuition, and spiritual connection. Love fortunes resonate with Pisces's boundless empathy and capacity for deep emotional bonds." },
    { q: "How does Neptune shape Pisces's experience of fortune?", a: "Neptune dissolves boundaries between self and others, giving Pisces an almost psychic sensitivity. Fortunes often feel deeply personal to Pisces because they naturally find meaning and connection in symbolic language." },
  ],
};
```

- [ ] **Step 3: Add narrative section and methodology line to the page render**

Insert the narrative right after the hero section (after line 388 `</span>` closing of the element badge, before `{/* Today's Fortune */}`):

```tsx
        {/* Sign Narrative */}
        {SIGN_NARRATIVES[sign] && (
          <p className="text-center text-sm text-muted leading-relaxed max-w-lg mx-auto mt-4 mb-8">
            {SIGN_NARRATIVES[sign]}
          </p>
        )}
```

- [ ] **Step 4: Add methodology line after the About Sign section**

Insert after the closing `</div>` of the About Sign section (after line 452), before `{/* Fortune Cookie Wisdom */}`:

```tsx
        <p className="text-xs text-foreground/30 text-center mb-6">
          Based on traditional Western astrology
        </p>
```

- [ ] **Step 5: Replace template FAQs with sign-specific FAQs**

Replace the `faqs` const (lines 350-363):

Old:
```tsx
  const faqs = [
    {
      q: `What is today's fortune for ${signTitle}?`,
      a: `Today's fortune for ${signTitle} is: "${fortune.text}" — a ${category} fortune drawn from your ${zodiac.element} element.`,
    },
    {
      q: `What are the lucky numbers for ${signTitle} today?`,
      a: `Today's lucky numbers for ${signTitle} are: ${luckyNumbers.join(", ")}. These refresh daily.`,
    },
    {
      q: `How are ${signTitle} fortunes selected?`,
      a: `${signTitle} is a ${zodiac.element} sign, so fortunes are drawn from the ${category} category. A date-based seed ensures everyone with the same sign sees the same fortune each day.`,
    },
  ];
```

New:
```tsx
  const baseFaq = {
    q: `What is today's fortune for ${signTitle}?`,
    a: `Today's fortune for ${signTitle} is: "${fortune.text}" — a ${category} fortune drawn from your ${zodiac.element} element.`,
  };
  const signSpecificFaqs = SIGN_FAQS[sign] || [];
  const faqs = [baseFaq, ...signSpecificFaqs];
```

- [ ] **Step 6: Verify the build**

Run: `npm run build 2>&1 | grep -E "(error|Error)" | head -10`
Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add src/app/zodiac/\[sign\]/page.tsx
git commit -m "content: add unique narratives + sign-specific FAQs to zodiac pages"
```

---

### Task 5: Differentiate Horoscope Daily Pages + Add Attribution

**Files:**
- Modify: `src/app/horoscope/daily/[sign]/page.tsx`

- [ ] **Step 1: Add SIGN_DAILY_CONTEXT data**

Insert after the `SIGN_INSIGHTS` object (after line 112), before the `type PageProps` line:

```tsx
const SIGN_DAILY_CONTEXT: Record<string, string> = {
  aries: "Aries daily readings are driven by Mars, which shifts aspects every few days. When Mars is well-aspected, expect your horoscope to highlight bold opportunities. When Mars faces tension, the reading will steer you toward patience — a word Aries hears often but rarely enjoys.",
  taurus: "Your daily horoscope tracks Venus closely. Because Venus moves through each sign for about a month, Taurus readings tend to have a consistent emotional undertone that shifts gradually rather than dramatically from day to day.",
  gemini: "Mercury, your ruler, is the fastest-moving planet in astrology. This makes Gemini's daily horoscope more variable than most — the tone and focus can shift noticeably from one day to the next as Mercury forms and dissolves aspects rapidly.",
  cancer: "No other sign's daily horoscope changes as frequently as Cancer's. The Moon, your ruler, shifts signs every two to two and a half days and changes aspects every few hours, making each day's reading genuinely distinct.",
  leo: "The Sun moves about one degree per day, forming subtle but meaningful aspects with other planets. Leo's daily horoscope reflects these gradual shifts — small changes in energy and focus that build toward larger themes over weeks.",
  virgo: "Like Gemini, Virgo is ruled by Mercury, but your daily horoscope filters Mercury's energy through an earth-sign lens. Where Gemini's readings emphasize ideas, yours tend to focus on practical improvements and health.",
  libra: "Venus shapes your daily reading much as it does Taurus, but through an air-sign filter. Libra's horoscope tends to emphasize social dynamics, aesthetic choices, and the balance between your needs and others'.",
  scorpio: "Scorpio's daily horoscope draws from both Mars (traditional ruler) and Pluto (modern ruler). This dual influence creates readings with both surface-level action guidance and deeper undercurrents about transformation.",
  sagittarius: "Jupiter, your ruler, moves slowly — spending about a year in each sign. This gives Sagittarius daily readings a consistent philosophical backdrop, with day-to-day variation coming from faster-moving planets interacting with Jupiter's position.",
  capricorn: "Saturn, your ruler, is the slowest of the traditional planets. Capricorn's daily readings carry a steady, disciplined undertone that shifts only gradually, with daily variation coming from the Moon and inner planets.",
  aquarius: "Uranus, your modern ruler, moves so slowly that its influence is generational. Your daily horoscope gets its day-to-day variation from faster planets, but Uranus provides an underlying theme of innovation that colors every reading.",
  pisces: "Neptune's influence on your daily horoscope is subtle and pervasive rather than sharp and specific. Pisces readings often have a dreamlike quality, with practical guidance woven into more intuitive, feeling-based language.",
};
```

- [ ] **Step 2: Add sign-specific FAQ data**

Insert after `SIGN_DAILY_CONTEXT`:

```tsx
const DAILY_SIGN_FAQS: Record<string, { q: string; a: string }[]> = {
  aries: [
    { q: "When is the best time to read an Aries daily horoscope?", a: "Aries energy peaks in the morning. Reading your horoscope early helps you channel Mars-driven initiative into the day's first decisions." },
    { q: "How does Mars retrograde affect Aries daily readings?", a: "Mars retrograde (roughly every two years) slows Aries' natural momentum. During these periods, daily horoscopes often shift focus from action to reflection and strategy." },
  ],
  taurus: [
    { q: "Why do Taurus daily horoscopes often mention finances?", a: "Taurus rules the second house of money and values. Venus, your ruler, connects material comfort with personal worth, making financial themes a natural part of your daily reading." },
    { q: "How do Moon transits affect Taurus daily readings?", a: "When the Moon transits earth signs (Taurus, Virgo, Capricorn), your daily horoscope tends to be more grounded and productive. Water sign Moons bring out your emotional depth." },
  ],
  gemini: [
    { q: "Why does Gemini's daily horoscope change so much?", a: "Mercury, your ruler, is the fastest planet in the solar system. It forms and dissolves aspects rapidly, giving Gemini the most variable daily readings of any sign." },
    { q: "How does Mercury retrograde affect Gemini specifically?", a: "Mercury retrogrades hit Gemini harder than most signs because Mercury is your personal ruler. Daily readings during these periods emphasize reviewing, revising, and reconnecting rather than starting new projects." },
  ],
  cancer: [
    { q: "Why are Cancer horoscopes so emotionally specific?", a: "The Moon, Cancer's ruler, governs emotions and changes signs every 2-3 days. This lunar sensitivity makes Cancer's daily reading the most emotionally nuanced in the zodiac." },
    { q: "Do Full Moons affect Cancer more than other signs?", a: "Yes. As a Moon-ruled sign, Cancer feels Full Moon energy more intensely. Daily horoscopes around the Full Moon often address emotional release, relationship clarity, and heightened intuition." },
  ],
  leo: [
    { q: "What does it mean when Leo's career rating is high?", a: "High career ratings for Leo typically coincide with the Sun forming positive aspects to Jupiter or Mars. These are days when your natural leadership and charisma are especially effective." },
    { q: "How does Leo season (July-August) affect daily readings?", a: "During Leo season, the Sun is in your home sign, amplifying your natural confidence and vitality. Daily horoscopes during this period tend to be more empowering and action-oriented." },
  ],
  virgo: [
    { q: "Why does the Virgo daily horoscope mention health so often?", a: "Virgo rules the sixth house of health and daily routines. Mercury, your ruler, connects your mental state to physical wellbeing, making health a consistent theme in your readings." },
    { q: "When is Virgo's daily horoscope most accurate?", a: "Virgo readings tend to be most resonant when Mercury is direct and moving through earth or water signs. These periods align Mercury's analytical energy with Virgo's practical nature." },
  ],
  libra: [
    { q: "Why do Libra horoscopes focus on relationships?", a: "Libra rules the seventh house of partnerships. Venus, your ruler, orients your daily experience around connection, balance, and how you relate to others." },
    { q: "How do Venus transits affect Libra's daily reading?", a: "When Venus is in a compatible sign (air or fire), Libra daily horoscopes emphasize social success and creative flow. Challenging Venus aspects bring relationship lessons to the foreground." },
  ],
  scorpio: [
    { q: "Why are Scorpio horoscopes more intense than other signs?", a: "Scorpio is co-ruled by Mars (action, desire) and Pluto (transformation, depth). This dual rulership gives Scorpio readings a layered quality that addresses both surface events and deeper psychological currents." },
    { q: "How do Pluto transits affect Scorpio daily readings?", a: "Pluto moves slowly, so its influence creates long background themes in Scorpio's daily horoscope. Day-to-day variation comes from faster planets, but Pluto sets the deeper transformative context." },
  ],
  sagittarius: [
    { q: "Why do Sagittarius horoscopes mention travel and learning?", a: "Sagittarius rules the ninth house of long-distance travel, higher education, and philosophical exploration. Jupiter, your ruler, expands whatever it touches, making these themes central to your daily reading." },
    { q: "What makes Jupiter transits significant for Sagittarius?", a: "Jupiter spends about a year in each sign. When it enters a new sign, the background theme of your daily horoscope shifts noticeably, coloring your readings for the entire year." },
  ],
  capricorn: [
    { q: "Why do Capricorn daily horoscopes emphasize long-term thinking?", a: "Saturn, your ruler, is the planet of time, discipline, and earned achievement. Capricorn daily readings naturally reflect Saturn's orientation toward sustainable progress rather than quick wins." },
    { q: "How does Saturn return affect Capricorn readings?", a: "Saturn return (around ages 29 and 58) is especially significant for Capricorn. During these periods, daily horoscopes carry extra weight around themes of maturity, responsibility, and life structure." },
  ],
  aquarius: [
    { q: "Why does the Aquarius horoscope mention innovation?", a: "Uranus, your modern ruler, governs sudden insight, technology, and unconventional thinking. Daily readings for Aquarius often highlight moments where breaking from routine leads to breakthroughs." },
    { q: "How is Aquarius different from other air signs in daily readings?", a: "While Gemini's readings emphasize communication and Libra's focus on relationships, Aquarius daily horoscopes center on collective progress, intellectual independence, and systemic thinking." },
  ],
  pisces: [
    { q: "Why do Pisces daily horoscopes feel dreamlike?", a: "Neptune, your modern ruler, governs dreams, intuition, and the dissolution of boundaries. This gives Pisces readings a more poetic, feeling-based quality compared to other signs." },
    { q: "How does Neptune retrograde affect Pisces daily readings?", a: "Neptune retrograde (about five months each year) brings clarity to areas where Pisces may have been idealizing. Daily horoscopes during this period tend to be more grounded and reality-focused." },
  ],
};
```

- [ ] **Step 3: Insert daily context section into the page render**

Insert after the horoscope card section (after line 237 `)}`, before the weekly/monthly nav buttons), add:

```tsx
        {SIGN_DAILY_CONTEXT[sign] && (
          <p className="text-xs text-muted leading-relaxed text-center mb-6">
            {SIGN_DAILY_CONTEXT[sign]}
          </p>
        )}
```

- [ ] **Step 4: Add methodology attribution after the horoscope card area**

Insert right after the new `SIGN_DAILY_CONTEXT` paragraph (before the weekly/monthly nav buttons):

```tsx
        <p className="text-xs text-foreground/30 text-center mb-6">
          Based on traditional Western astrology and current planetary positions
        </p>
```

- [ ] **Step 5: Replace template FAQs with sign-specific FAQs**

Replace the `faqs` const (lines 170-179):

Old:
```tsx
  const faqs = [
    {
      q: `What is today's horoscope for ${signTitle}?`,
      a: daily ? `Today's ${signTitle} horoscope: "${daily.text.slice(0, 120)}..."` : `Check back for today's ${signTitle} horoscope.`,
    },
    {
      q: `What are ${signTitle}'s lucky numbers today?`,
      a: daily ? `Today's lucky number for ${signTitle} is ${daily.luckyNumber}. Lucky color: ${daily.luckyColor}.` : "Check back daily for updated lucky numbers.",
    },
  ];
```

New:
```tsx
  const baseFaq = {
    q: `What is today's horoscope for ${signTitle}?`,
    a: daily ? `Today's ${signTitle} horoscope: "${daily.text.slice(0, 120)}..."` : `Check back for today's ${signTitle} horoscope.`,
  };
  const signSpecificFaqs = DAILY_SIGN_FAQS[sign] || [];
  const faqs = [baseFaq, ...signSpecificFaqs];
```

- [ ] **Step 6: Verify the build**

Run: `npm run build 2>&1 | grep -E "(error|Error)" | head -10`
Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add src/app/horoscope/daily/\[sign\]/page.tsx
git commit -m "content: add unique daily context + sign-specific FAQs to horoscope pages"
```

---

### Task 6: Humanize Horoscope Generation Prompts

**Files:**
- Modify: `scripts/generate-horoscopes.ts` (lines 86-104, daily prompt)

- [ ] **Step 1: Update the daily horoscope generation prompt**

Replace the prompt content in `generateDaily` (lines 87-104):

Old:
```typescript
        content: `You are an expert astrologer writing daily horoscopes. Generate today's horoscope for all 12 zodiac signs.

Date: ${getToday()}. Season: ${getSeasonContext()}.
Write engaging, warm English. Reference planetary movements. Each sign: 2-3 sentences (40-80 words). Vary tone.

Signs: ${signList}

Output JSON object with lowercase sign keys. Each value:
- "text": string (2-3 sentences)
- "love": number 1-5
- "career": number 1-5
- "health": number 1-5
- "luckyNumber": number 1-99
- "luckyColor": string (from: ${COLORS.join(", ")})
- "mood": string (from: ${MOODS.join(", ")})

Ensure variety in ratings. Unique luckyNumber, luckyColor, mood per sign.
Return ONLY JSON. No markdown fences.`,
```

New:
```typescript
        content: `You are writing daily horoscopes for fortunecrack.com. Generate today's horoscope for all 12 zodiac signs.

Date: ${getToday()}. Season: ${getSeasonContext()}.

VOICE GUIDELINES:
- Write like a knowledgeable friend giving advice over coffee, not a textbook or newspaper column.
- Vary sentence structure across signs. Some horoscopes should open with a question, some with an observation, some with advice.
- Mix practical daily suggestions ("call that person back", "take the longer route home") with reflective moments.
- Vary length naturally: some signs get 2 sentences, others 3-4. Not every horoscope should be the same length.
- Reference planetary movements where relevant, but do not start every horoscope with a planet name.

DO NOT USE THESE PATTERNS:
- "Mars charges through your X sector"
- "Venus graces your Y house"
- "The cosmos aligns to bring"
- "Planetary energies suggest"
- "Celestial bodies indicate"
- "The stars are aligned for"
- Starting 3+ horoscopes with the same sentence structure

Signs: ${signList}

Output JSON object with lowercase sign keys. Each value:
- "text": string (2-4 sentences, 40-100 words, varied per sign)
- "love": number 1-5
- "career": number 1-5
- "health": number 1-5
- "luckyNumber": number 1-99
- "luckyColor": string (from: ${COLORS.join(", ")})
- "mood": string (from: ${MOODS.join(", ")})

Ensure variety in ratings. Unique luckyNumber, luckyColor, mood per sign.
Return ONLY JSON. No markdown fences.`,
```

- [ ] **Step 2: Update the weekly horoscope generation prompt**

Replace the prompt in `generateWeekly` (lines 122-128):

Old:
```typescript
        content: `Expert astrologer writing weekly horoscopes. Week of: ${getWeekStart()}. Season: ${getSeasonContext()}.
English with depth. Reference planetary aspects. Each section: 2-3 sentences.

Signs: ${signList}
```

New:
```typescript
        content: `Writing weekly horoscopes for fortunecrack.com. Week of: ${getWeekStart()}. Season: ${getSeasonContext()}.

VOICE: Warm, conversational, like a knowledgeable friend. Vary sentence structure across signs. Mix practical advice with reflection. Do not start sections with planet names. Avoid "the cosmos aligns" and similar cliches.

Each section: 2-3 sentences with varied length across signs.

Signs: ${signList}
```

- [ ] **Step 3: Update the monthly horoscope generation prompt**

Replace the prompt in `generateMonthly` (lines 154-157):

Old:
```typescript
        content: `Expert astrologer writing monthly horoscopes for ${monthName}. Season: ${getSeasonContext()}.
English with depth and warmth. Reference major transits. Each section: 2-4 sentences.

Signs: ${signList}
```

New:
```typescript
        content: `Writing monthly horoscopes for fortunecrack.com for ${monthName}. Season: ${getSeasonContext()}.

VOICE: Warm, editorial, conversational. Vary structure across signs — some overviews should open with a question, some with a bold statement, some with a specific scenario. Reference major transits where relevant but do not lead with planet names. Avoid cliches like "the cosmos aligns" or "celestial energies suggest."

Each section: 2-4 sentences with naturally varied length.

Signs: ${signList}
```

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-horoscopes.ts
git commit -m "content: humanize horoscope generation prompts for more natural text"
```

---

### Task 7: Humanize Blog Generation Prompts

**Files:**
- Modify: `scripts/generate-post.ts` (lines 286-301, writing prompt)

- [ ] **Step 1: Update the blog post writing prompt**

Replace the "Additional requirements" section in the Stage 3 prompt (lines 295-301):

Old:
```typescript
Additional requirements:
- Use ## H2 headings for sections (NEVER use # H1 — the page template adds the H1)
- Do NOT include the title as a heading
- Do NOT include frontmatter
- Start directly with an engaging opening paragraph
- End with a complete, thoughtful conclusion. The conclusion MUST be a full, well-formed paragraph — never end mid-sentence
- IMPORTANT: Make sure every sentence is complete
- IMPORTANT: The post must be AT LEAST 1,400 words. Shorter posts will be rejected.`,
```

New:
```typescript
VOICE AND STYLE GUIDELINES:
- Write in a warm, conversational editorial voice — like a trusted friend who knows things, not a researcher presenting findings.
- Include specific examples, anecdotes, or scenarios — not just abstract advice.
- Vary paragraph lengths. Some short (1-2 sentences). Some longer. Not every paragraph should be the same size.
- Not every post needs to be a listicle. Use narrative, Q&A, essay, or storytelling formats where they fit the topic.
- Avoid generic AI writing patterns: "In today's fast-paced world", "Let's dive in", "In conclusion", "Whether you're X or Y", "Have you ever wondered", "It's no secret that".
- Do not use the word "tapestry" or "rich tapestry" in any context.

FORMAT REQUIREMENTS:
- Use ## H2 headings for sections (NEVER use # H1 — the page template adds the H1)
- Do NOT include the title as a heading
- Do NOT include frontmatter
- Start directly with an engaging opening paragraph
- End with a complete, thoughtful conclusion. The conclusion MUST be a full, well-formed paragraph — never end mid-sentence
- IMPORTANT: Make sure every sentence is complete
- IMPORTANT: The post must be AT LEAST 1,400 words. Shorter posts will be rejected.`,
```

- [ ] **Step 2: Commit**

```bash
git add scripts/generate-post.ts
git commit -m "content: add voice guidelines to blog generation prompts"
```

---

### Task 8: Final Build Verification

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No new lint errors.

- [ ] **Step 3: Spot-check a zodiac page**

Run: `npm run dev` and visit `/zodiac/aries` in browser. Verify:
- Unique narrative paragraph appears below the hero
- "Based on traditional Western astrology" line visible
- Sign-specific FAQ questions visible (not template-swapped)

- [ ] **Step 4: Spot-check a horoscope page**

Visit `/horoscope/daily/cancer`. Verify:
- Daily context paragraph appears
- Attribution line visible
- Sign-specific FAQ questions visible
