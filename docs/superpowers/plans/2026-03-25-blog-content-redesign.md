# Blog Content Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-template auto-blog pipeline with a 6-archetype system that produces emotionally resonant, structurally varied blog posts for traffic growth and AdSense approval.

**Architecture:** Refactor `scripts/generate-post.ts` to rotate through 6 archetype definitions (each with its own topic selection and writing prompts). Update downstream scripts (`quality-check.ts`, `auto-fix.ts`, `validate-content.ts`) to be archetype-aware. Add `archetype` field to blog post frontmatter and the `BlogPost` interface.

**Tech Stack:** TypeScript, Anthropic Claude API, gray-matter, Node.js scripts, MDX

**Spec:** `docs/superpowers/specs/2026-03-25-blog-content-redesign.md`

**Note:** This project has no test framework. Verification steps use script execution and output inspection.

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `scripts/lib/archetypes.ts` | Archetype definitions: names, topic prompts, writing prompts, quality rules |
| Modify | `scripts/generate-post.ts:24-30,66-68,72-103,127-149,184-211,233-239` | Replace CONTENT_PILLARS with archetype rotation; use per-archetype prompts |
| Modify | `scripts/quality-check.ts:77-92,106-128` | Per-archetype H2 minimum, internal link check, AI review criteria |
| Modify | `scripts/auto-fix.ts:108-126` | Archetype-aware trailing sentence trimmer |
| Modify | `scripts/validate-content.ts:240-265` | Soft-validate archetype field in blog posts |
| Modify | `src/lib/blog.ts:7-14,20-31` | Add archetype to BlogPost interface and parseBlogPost |

---

### Task 1: Create archetype definitions module

**Files:**
- Create: `scripts/lib/archetypes.ts`

This is the core data module. All other tasks depend on it.

- [ ] **Step 1: Create the archetype type and constants**

Create `scripts/lib/archetypes.ts` with the following content:

```typescript
/**
 * Blog post archetype definitions.
 *
 * Each archetype defines a distinct emotional structure, voice, and quality
 * rules for the auto-blog pipeline. The pipeline rotates through archetypes
 * to produce structurally varied content.
 */

export interface ArchetypeQualityRules {
  h2Minimum: number;
  internalLinkRequired: boolean; // false = warning only, true = hard fail
}

export interface Archetype {
  name: string;
  topicPrompt: string;
  writingPrompt: string;
  qualityRules: ArchetypeQualityRules;
}

export const VALID_ARCHETYPE_NAMES = [
  "midnight-question",
  "honest-answer",
  "one-thing-deeply",
  "counterintuitive-truth",
  "list-that-teaches",
  "timely-transit",
] as const;

export type ArchetypeName = (typeof VALID_ARCHETYPE_NAMES)[number];

const VOICE_PREAMBLE = `Voice guidelines (apply to ALL posts):
- Write like a trusted friend who knows things, not a researcher presenting findings.
- When citing studies, weave them into the narrative. Never open a section with "Research by Dr. X found that..."
- Acknowledge uncertainty honestly: "Maybe — that's always possible."
- Every concept must land in something the reader can do or feel.
- Treat the reader as a capable adult. No condescension, no "you might be wondering..." filler.
- Do NOT apologize for the subject matter or add "for entertainment purposes only" disclaimers.
- Treat astrology, fortune-telling, and luck rituals as legitimate cultural practices with real psychological benefits.`;

const LINK_TARGETS = `Available internal links (use 1-2 where contextually relevant):
- [break a fortune cookie](/) — homepage, interactive cookie
- [daily fortune](/daily) — today's fortune + 7-day history
- [lucky numbers](/lucky-numbers) — daily lucky numbers
- [your horoscope](/horoscope) — horoscope hub
- [Aries daily horoscope](/horoscope/daily/aries) — (substitute any of the 12 signs)
- [zodiac fortune for Scorpio](/zodiac/scorpio) — (substitute any of the 12 signs)
- [love fortunes](/fortune/love) — (substitute: wisdom, career, humor, motivation, philosophy, mystery, adventure)`;

export const ARCHETYPES: Archetype[] = [
  {
    name: "midnight-question",
    topicPrompt: `Generate a blog post topic for the "Midnight Question" archetype.
This post opens with a specific emotional moment the reader recognizes (searching for signs, questioning choices, seeking reassurance) and explores it through psychology or culture before landing on a reframe.

The topic should target a question or feeling people actually Google when they're uncertain, anxious, or seeking meaning. Think: "is this a sign", "why do I keep seeing the same number", "what does my fortune cookie mean".`,
    writingPrompt: `${VOICE_PREAMBLE}

You are writing for someone who is alone with their phone at midnight, looking for reassurance that what they're feeling makes sense. Your job is not to teach them something — it's to make them feel understood, and then show them a way of thinking about their experience that they hadn't considered.

Do NOT write like a textbook. Do NOT open with a topic statement. Open with a moment: what the reader is doing, feeling, or thinking right now. Use "you" — put them in the scene.

Structure: emotional opening (200 words) -> validation + exploration (600-800 words, going deep on 1-2 ideas rather than skimming many) -> the reframe (200-300 words) -> a closing line that lingers.

Word count: 1,200-1,800 words.

Internal links: Only include a link if the reframe naturally connects to fortune-seeking behavior. If it feels forced, skip it entirely.

${LINK_TARGETS}`,
    qualityRules: { h2Minimum: 1, internalLinkRequired: false },
  },
  {
    name: "honest-answer",
    topicPrompt: `Generate a blog post topic for the "Honest Answer" archetype.
This post takes a question people actually Google about fortune cookies, horoscopes, luck, or astrology — and gives the honest middle ground that no other site occupies. Not dismissive ("no, obviously") and not credulous ("yes, here's proof!").

The topic should be a real search query like "do fortune cookies come true", "do horoscopes work", "are zodiac signs real", "is astrology scientifically proven".`,
    writingPrompt: `${VOICE_PREAMBLE}

You are answering a question that someone actually typed into Google. They've already seen the dismissive answers and the credulous ones. Give them the honest middle ground — the answer that respects their intelligence.

Open by stating the question plainly. Acknowledge the obvious answer in the first paragraph so the reader knows you're not going to waste their time. Then go deeper.

Structure: the question + obvious answer (150 words) -> why that's incomplete (200 words) -> the real answer explored in depth (600-800 words) -> the honest conclusion (150 words).

Word count: 1,000-1,500 words.

Tone: direct, slightly wry, never condescending. You're the smart friend who gives real answers, not the professor who lectures.

${LINK_TARGETS}`,
    qualityRules: { h2Minimum: 3, internalLinkRequired: true },
  },
  {
    name: "one-thing-deeply",
    topicPrompt: `Generate a blog post topic for the "One Thing, Deeply" archetype.
This post takes a SINGLE specific cultural practice, object, place, or tradition related to fortune-telling, luck, or divination and explores it in rich sensory detail. NOT a survey of multiple cultures — go deep on ONE thing.

Topics like: omikuji (Japanese paper fortunes), the fortune cookie factory in Brooklyn, morijio (Japanese salt piles), nazar amulets, a specific tarot card's history, one Chinese New Year fortune tradition.`,
    writingPrompt: `${VOICE_PREAMBLE}

You are a travel writer who happens to know a lot about cultural traditions. Write about ONE specific thing in enough detail that the reader feels they've been there.

Open with a single, vivid image — not a thesis statement. Describe what you'd see, hear, or touch. Then expand outward: where does this tradition come from? What does the ritual look like step by step? What do the practitioners believe, and why?

Do NOT survey multiple cultures in one post. Go deep on ONE. Use specific names, places, textures, and sequences. A reader should be able to close their eyes and picture the scene.

Structure: vivid opening image (150 words) -> the full story/tradition expanded (800-1000 words with sensory detail) -> the universal human need it addresses (200 words) -> return to the opening image, transformed (100 words).

Word count: 1,200-1,800 words.

Internal links: Only if the cultural practice directly involves fortune-telling or luck. Otherwise skip entirely.

${LINK_TARGETS}`,
    qualityRules: { h2Minimum: 1, internalLinkRequired: false },
  },
  {
    name: "counterintuitive-truth",
    topicPrompt: `Generate a blog post topic for the "Counterintuitive Truth" archetype.
This post challenges a widely held belief about luck, fortune, astrology, or positive thinking with evidence that contradicts the conventional wisdom. The goal is a genuine perspective shift, not clickbait contrarianism.

Topics like: "trying to be lucky makes you unlucky", "your bad zodiac traits are your superpowers", "positive thinking can backfire", "superstitions actually work (through psychology)".`,
    writingPrompt: `${VOICE_PREAMBLE}

You are writing a piece that will make someone say "I never thought about it that way" and send it to a friend. The goal is a genuine perspective shift, not clickbait contrarianism.

Open by stating the conventional wisdom fairly — don't strawman it. Then present specific evidence (name the researcher, cite the study, describe the experiment) that complicates or contradicts it. Explain the mechanism — why does the conventional wisdom get it wrong?

Structure: the belief stated fairly (150 words) -> the complicating evidence (400-500 words, specific studies) -> why the conventional wisdom fails (200-300 words) -> the counterintuitive conclusion (200 words) -> one thing to do differently (100 words).

Word count: 1,000-1,500 words.

CRITICAL: Prefer well-known, easily verifiable research (Wiseman, Kahneman, Sharot, Seligman, Langer) over obscure studies. If you cannot cite a specific real study, reframe the argument around well-documented psychological principles instead. Do NOT invent researchers or studies.

${LINK_TARGETS}`,
    qualityRules: { h2Minimum: 3, internalLinkRequired: true },
  },
  {
    name: "list-that-teaches",
    topicPrompt: `Generate a blog post topic for the "List That Teaches" archetype.
This is a numbered list post where every item teaches something genuinely useful. NOT a shallow listicle — each item is a mini-essay with research backing and a specific action the reader can try today.

Topics like: "experiments that make this week feel luckier", "fortune cookie messages that will haunt you", "psychology tricks for better intuition", "morning rituals that actually change your day".`,
    writingPrompt: `${VOICE_PREAMBLE}

You are writing a list post where every single item teaches something the reader can use today. This is NOT a listicle — each item is a 150-200 word mini-essay with a specific action the reader can take.

Open with a clear, direct promise (1-2 sentences). Then deliver 5-7 items, each with:
(a) the idea/technique stated clearly
(b) why it works (cite research or explain the mechanism in 1-2 sentences)
(c) a specific action the reader can try today or this week

Do NOT pad the list with obvious or generic advice ("be more grateful," "think positive"). Every item should make the reader think "I wouldn't have thought of that."

Structure: promise (50 words) -> 5-7 items (150-200 words each) -> unifying insight (100 words).

Word count: 1,200-1,800 words.

${LINK_TARGETS}`,
    qualityRules: { h2Minimum: 3, internalLinkRequired: true },
  },
  {
    name: "timely-transit",
    topicPrompt: `Generate a blog post topic for the "Timely Transit" archetype.
This post covers a specific upcoming astrological event — a full moon, new moon, mercury retrograde, eclipse, equinox, solstice, or major planetary conjunction. It must reference a REAL event with an accurate date.

The post provides practical, grounded guidance for the event period. Think CHANI-style: specific dates, actionable numbered items, warm authority.

Major upcoming events to consider: full moons, new moons, mercury retrogrades, Venus retrogrades, eclipses, equinoxes, solstices, and notable conjunctions in the coming weeks.`,
    writingPrompt: `${VOICE_PREAMBLE}

You are a trusted astrologer-friend writing about a specific upcoming astrological event. Your reader checks their horoscope daily and wants to know: what does this event mean for MY life, and what should I actually DO about it?

Open with specifics: the event name, exact date, and a one-line takeaway. Then explain what's happening astrologically in plain language — assume the reader knows zodiac signs but not planetary mechanics.

Connect the transit to real life: relationships, career decisions, energy levels, timing. Be specific and practical, not vague. "This is a good week to have the conversation you've been avoiding" beats "communication may be highlighted."

Include 5-8 numbered action items. These should be concrete: "postpone signing contracts until after the 15th" not "be mindful of agreements."

Close with a grounding, human note. Cosmic events are real, but so is the need for rest.

Structure: event + date + takeaway (100 words) -> astrological context explained accessibly (200-300 words) -> real-life implications by domain (300-400 words) -> 5-8 numbered action items (300-400 words) -> grounding close (50 words).

Word count: 1,000-1,500 words.

CRITICAL: Use real upcoming astrological events with accurate dates. If unsure of exact timing, frame the content around the general period ("late March") rather than fabricating a precise timestamp.

${LINK_TARGETS}`,
    qualityRules: { h2Minimum: 3, internalLinkRequired: true },
  },
];
```

- [ ] **Step 2: Verify the module compiles**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx tsx -e "const a = require('./scripts/lib/archetypes'); console.log(a.ARCHETYPES.length + ' archetypes loaded')"`
Expected: `6 archetypes loaded`

- [ ] **Step 3: Commit**

```bash
git add scripts/lib/archetypes.ts
git commit -m "feat(blog): add archetype definitions module for 6 content archetypes"
```

---

### Task 2: Refactor generate-post.ts to use archetypes

**Files:**
- Modify: `scripts/generate-post.ts:24-30` (replace CONTENT_PILLARS)
- Modify: `scripts/generate-post.ts:66-103` (Stage 1 topic selection)
- Modify: `scripts/generate-post.ts:184-211` (Stage 2 writing prompt)
- Modify: `scripts/generate-post.ts:233-239` (frontmatter)

- [ ] **Step 1: Replace CONTENT_PILLARS import and rotation**

In `scripts/generate-post.ts`, replace lines 24-30 (`CONTENT_PILLARS` array) with:

```typescript
import { ARCHETYPES } from "./lib/archetypes";
```

Then at line 66 (pillar rotation), replace:
```typescript
const pillarIndex = existingFiles.length % CONTENT_PILLARS.length;
const pillar = CONTENT_PILLARS[pillarIndex];
log.info(`Content pillar: ${pillar}`);
```
with:
```typescript
const archetypeIndex = existingFiles.length % ARCHETYPES.length;
const archetype = ARCHETYPES[archetypeIndex];
log.info(`Archetype: ${archetype.name}`);
```

- [ ] **Step 2: Update Stage 1 topic prompt**

Replace the Stage 1 topic prompt (lines 79-99) with one that uses `archetype.topicPrompt`. The full user content becomes:

```typescript
content: `You are a blog content strategist for fortunecrack.com, an interactive fortune cookie website where users can virtually break fortune cookies.

${archetype.topicPrompt}

Existing blog post titles (DO NOT duplicate these topics):
${existingTitles.map((t) => "- " + t).join("\n")}

Generate ONE new blog post topic. Return ONLY a JSON object with no other text:
{
  "title": "SEO-friendly title with target keyword (50-70 chars)",
  "slug": "url-friendly-slug-lowercase-hyphens",
  "excerpt": "Compelling meta description under 155 characters",
  "keywords": ["primary keyword", "secondary keyword"]
}

Requirements:
- Title must be engaging and include a target keyword
- Slug: lowercase, hyphens only, no special characters
- Excerpt: under 155 characters, compelling for search results
- Topic must be completely unique from existing posts`,
```

Do the same for the retry prompt (lines 127-149) — replace the content pillar reference with `archetype.topicPrompt`.

- [ ] **Step 3: Update Stage 2 writing prompt**

Replace the Stage 2 prompt (lines 191-207) to use `archetype.writingPrompt`:

```typescript
content: `Write a blog post for fortunecrack.com, an interactive fortune cookie website where users can virtually break fortune cookies to reveal their fortunes.

Title: "${finalTopic.title}"
Target keywords: ${finalTopic.keywords.join(", ")}

${archetype.writingPrompt}

Additional requirements:
- Use ## H2 headings for sections (NEVER use # H1 — the page template adds the H1)
- Do NOT include the title as a heading
- Do NOT include frontmatter
- Start directly with an engaging opening paragraph
- End with a complete, thoughtful conclusion. The conclusion MUST be a full, well-formed paragraph — never end mid-sentence
- IMPORTANT: Make sure every sentence is complete`,
```

- [ ] **Step 4: Add archetype to frontmatter**

At lines 233-239 where the MDX frontmatter is built, add the archetype field:

```typescript
const mdxContent = matter.stringify(content.trim(), {
  title: finalTopic.title,
  date: today,
  readTime,
  excerpt: finalTopic.excerpt,
  archetype: archetype.name,
});
```

- [ ] **Step 5: Verify generation works**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && ANTHROPIC_API_KEY=test npx tsx -e "
const fs = require('fs');
const src = fs.readFileSync('scripts/generate-post.ts', 'utf-8');
// Verify the imports and archetype references exist
console.log('Has ARCHETYPES import:', src.includes('import { ARCHETYPES }'));
console.log('Has archetype.name:', src.includes('archetype.name'));
console.log('Has archetype.topicPrompt:', src.includes('archetype.topicPrompt'));
console.log('Has archetype.writingPrompt:', src.includes('archetype.writingPrompt'));
console.log('No CONTENT_PILLARS:', !src.includes('CONTENT_PILLARS'));
"`
Expected: All `true`

- [ ] **Step 6: Commit**

```bash
git add scripts/generate-post.ts
git commit -m "feat(blog): refactor generate-post to use archetype-based prompts

Replace CONTENT_PILLARS rotation with 6-archetype system. Each archetype
has its own topic selection and writing prompts. Adds archetype field
to generated post frontmatter."
```

---

### Task 3: Update quality-check.ts for archetype-aware validation

**Files:**
- Modify: `scripts/quality-check.ts:77-92` (H2 and link checks)
- Modify: `scripts/quality-check.ts:106-128` (AI review prompt)

- [ ] **Step 1: Import archetype types and add helper**

At the top of `quality-check.ts`, add:

```typescript
import { VALID_ARCHETYPE_NAMES, ARCHETYPES, type ArchetypeName } from "./lib/archetypes";
```

After the `getSlug` function, add a helper to get quality rules:

```typescript
function getQualityRules(archetype: string | undefined) {
  const match = ARCHETYPES.find((a) => a.name === archetype);
  // Default rules for posts without archetype (legacy posts)
  return match?.qualityRules ?? { h2Minimum: 3, internalLinkRequired: true };
}
```

- [ ] **Step 2: Make H2 check archetype-aware**

Replace lines 77-83 (H2 count check):

```typescript
// 3. H2 count (archetype-aware)
const h2Count = (content.match(/^## /gm) || []).length;
const rules = getQualityRules(data.archetype);
log.info(`H2 headings: ${h2Count} (min: ${rules.h2Minimum}, archetype: ${data.archetype || "legacy"})`);
if (h2Count < rules.h2Minimum) {
  result.issues.push(`Too few H2 headings: ${h2Count} (min ${rules.h2Minimum} for ${data.archetype || "legacy"})`);
  result.pass = false;
}
```

- [ ] **Step 3: Make internal link check archetype-aware**

Replace lines 85-92 (internal link check):

```typescript
// 4. Internal link (archetype-aware)
const hasInternalLink =
  content.includes("fortunecrack.com") ||
  content.includes("](/") ||
  content.includes("/blog/");
log.info(`Internal link: ${hasInternalLink ? "yes" : "no"} (required: ${rules.internalLinkRequired ? "hard" : "soft"})`);
if (!hasInternalLink) {
  if (rules.internalLinkRequired) {
    result.issues.push("No internal link found (required for this archetype)");
    result.pass = false;
  } else {
    log.warn("No internal link found (optional for this archetype)");
  }
}
```

Note: The link check now also detects relative links like `](/daily)` and `](/horoscope/daily/aries)`, not just `fortunecrack.com`.

- [ ] **Step 4: Update AI review prompt with archetype context**

In the AI review section (lines 106-128), update the prompt to include archetype-specific criteria. Replace the prompt content:

```typescript
content: `Rate this blog post on a scale of 1-10 for quality, engagement, and SEO value. Be strict — a 6 is the minimum acceptable quality.

Context: This post is published on fortunecrack.com (a fortune cookie website). The post archetype is "${data.archetype || "legacy"}".

Archetype-specific criteria:${data.archetype === "midnight-question" ? " Does the opening create emotional recognition? Is there a genuine reframe?" : ""}${data.archetype === "honest-answer" ? " Does it acknowledge the obvious answer first? Is the real answer surprising?" : ""}${data.archetype === "one-thing-deeply" ? " Does it stay focused on one subject? Are there sensory details?" : ""}${data.archetype === "counterintuitive-truth" ? " Is the contrarian claim supported by specific, verifiable evidence?" : ""}${data.archetype === "list-that-teaches" ? " Does every list item include a specific, actionable suggestion?" : ""}${data.archetype === "timely-transit" ? " Does it reference a real astrological event with an accurate date? Are the action items concrete?" : ""}

General criteria: content quality, completeness (no truncated endings), structure, readability, SEO value. Internal links to the site are expected and should NOT be penalized.

Return ONLY a JSON object:
{"score": <number>, "feedback": "<one sentence>"}

Title: ${data.title}

${content}`,
```

- [ ] **Step 5: Verify the file compiles**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx tsx -e "const src = require('fs').readFileSync('scripts/quality-check.ts','utf-8'); console.log('Has getQualityRules:', src.includes('getQualityRules')); console.log('Has archetype-aware H2:', src.includes('rules.h2Minimum')); console.log('Has archetype-aware link:', src.includes('rules.internalLinkRequired'));"`
Expected: All `true`

- [ ] **Step 6: Commit**

```bash
git add scripts/quality-check.ts
git commit -m "feat(blog): make quality-check archetype-aware

Per-archetype H2 minimums (1 for narrative, 3 for structured).
Per-archetype internal link enforcement (warning vs hard fail).
Archetype-specific AI review criteria."
```

---

### Task 4: Update auto-fix.ts for archetype-aware trimming

**Files:**
- Modify: `scripts/auto-fix.ts:108-126` (Fix 7 trailing sentence trimmer)

- [ ] **Step 1: Make Fix 7 archetype-aware**

Replace lines 108-126 (Fix 7) with:

```typescript
// Fix 7: Trim incomplete trailing sentence (truncation artifact)
// Narrative archetypes (midnight-question, one-thing-deeply) may use
// stylistic endings like em-dashes or ellipses — don't trim those.
const narrativeArchetypes = ["midnight-question", "one-thing-deeply"];
const isNarrative = narrativeArchetypes.includes(String(fixedData.archetype || ""));
const trimmed = fixedContent.trimEnd();

if (trimmed.length > 0) {
  const validEnding = isNarrative
    ? /[.!?'")\u2019\u201D\u2014\u2026]$/ // allow em-dash and ellipsis for narrative
    : /[.!?'")\u2019\u201D]$/;

  if (!validEnding.test(trimmed)) {
    const lastEnd = Math.max(
      trimmed.lastIndexOf(". "),
      trimmed.lastIndexOf(".\n"),
      trimmed.lastIndexOf("! "),
      trimmed.lastIndexOf("!\n"),
      trimmed.lastIndexOf("? "),
      trimmed.lastIndexOf("?\n"),
    );
    const endsClean = /[.!?]$/.test(trimmed);
    if (!endsClean && lastEnd > trimmed.length * 0.5) {
      fixedContent = trimmed.slice(0, lastEnd + 1) + "\n";
      fixes.push("Trimmed incomplete trailing sentence (likely truncation artifact)");
    }
  }
}
```

- [ ] **Step 2: Verify**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx tsx -e "const src = require('fs').readFileSync('scripts/auto-fix.ts','utf-8'); console.log('Has narrativeArchetypes:', src.includes('narrativeArchetypes')); console.log('Has isNarrative:', src.includes('isNarrative'));"`
Expected: Both `true`

- [ ] **Step 3: Commit**

```bash
git add scripts/auto-fix.ts
git commit -m "feat(blog): make auto-fix trailing trimmer archetype-aware

Narrative archetypes (midnight-question, one-thing-deeply) can end
with em-dashes or ellipses without being trimmed."
```

---

### Task 5: Update validate-content.ts with archetype soft-validation

**Files:**
- Modify: `scripts/validate-content.ts:229-268` (blog validation section)

- [ ] **Step 1: Add archetype soft-validation**

Add at the top of `validate-content.ts`:

```typescript
import { VALID_ARCHETYPE_NAMES } from "./lib/archetypes";
```

Then inside the `validateBlog` function, after the H1 check (around line 265), add archetype validation using the existing regex-parsed frontmatter string (no need for a second parser):

```typescript
    // Check archetype field (soft validation — optional for legacy posts)
    const archetypeMatch = frontmatter.match(/^archetype:\s*['"]?([a-z-]+)['"]?/m);
    if (archetypeMatch) {
      const archetype = archetypeMatch[1];
      if (!(VALID_ARCHETYPE_NAMES as readonly string[]).includes(archetype)) {
        logWarn(`${file}: invalid archetype "${archetype}" (valid: ${VALID_ARCHETYPE_NAMES.join(", ")})`);
      }
    }
```

This uses the existing `frontmatter` variable (extracted by the regex at line 234) and avoids adding a second parsing library.

- [ ] **Step 2: Verify**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx tsx scripts/validate-content.ts`
Expected: Validation PASSED (existing posts don't have archetype field, so no warnings)

- [ ] **Step 3: Commit**

```bash
git add scripts/validate-content.ts
git commit -m "feat(blog): add archetype soft-validation to content validator

Warns on invalid archetype values in blog post frontmatter.
Does not require archetype field (backward-compatible with legacy posts)."
```

---

### Task 6: Add archetype to BlogPost interface

**Files:**
- Modify: `src/lib/blog.ts:7-14,20-31`

- [ ] **Step 1: Update the BlogPost interface**

Add `archetype` as an optional field to the interface at line 7-14:

```typescript
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  archetype?: string;
}
```

- [ ] **Step 2: Update parseBlogPost to pass through archetype**

In the `parseBlogPost` function (lines 20-35), add archetype extraction:

```typescript
function parseBlogPost(slug: string, raw: string): BlogPost | null {
  try {
    const { data, content } = matter(raw);

    const title = String(data.title || "");
    const date = String(data.date || "");
    const readTime = String(data.readTime || "");
    const excerpt = String(data.excerpt || "");
    const archetype = data.archetype ? String(data.archetype) : undefined;

    if (!title || !date) return null;

    return { slug, title, date, readTime, excerpt, content, archetype };
  } catch {
    return null;
  }
}
```

- [ ] **Step 3: Verify build still works**

Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx next build 2>&1 | tail -5`
Expected: Build succeeds (adding an optional field is backward-compatible)

If the full build is too slow, verify with:
Run: `cd /Users/seongyongpark/project/swallowrock/fortune_cookie && npx tsx -e "const { getAllPosts } = require('./src/lib/blog'); const posts = getAllPosts(); console.log(posts.length + ' posts loaded'); console.log('First post archetype:', posts[0]?.archetype ?? 'none (legacy)');"`

- [ ] **Step 4: Commit**

```bash
git add src/lib/blog.ts
git commit -m "feat(blog): add optional archetype field to BlogPost interface

Passes through archetype from frontmatter when present.
Backward-compatible — legacy posts without archetype field still work."
```

---

### Task 7: End-to-end verification

This task verifies the full pipeline works together.

- [ ] **Step 1: Dry-run the generation pipeline**

Run the generate-post script to produce one real post (requires `ANTHROPIC_API_KEY`):

```bash
cd /Users/seongyongpark/project/swallowrock/fortune_cookie
npx tsx scripts/generate-post.ts
```

Check the output for:
- `Archetype: <name>` (should show one of the 6 archetypes, not a content pillar)
- A generated post file in `src/content/blog/`

- [ ] **Step 2: Check the generated post has archetype in frontmatter**

```bash
head -10 src/content/blog/$(cat .generated-slug).mdx
```

Expected: frontmatter includes `archetype: <name>`

- [ ] **Step 3: Run auto-fix on the generated post**

```bash
npx tsx scripts/auto-fix.ts
```

Expected: Either "No fixes needed" or specific fixes applied without errors

- [ ] **Step 4: Run quality-check on the generated post**

```bash
npx tsx scripts/quality-check.ts
```

Expected: "All quality checks passed" — the archetype-aware rules should apply correctly

- [ ] **Step 5: Run full content validation**

```bash
npx tsx scripts/validate-content.ts
```

Expected: "Validation PASSED" — the new post's archetype field is soft-validated

- [ ] **Step 6: Verify the post loads in the blog system**

```bash
npx tsx -e "const { getPost } = require('./src/lib/blog'); const slug = require('fs').readFileSync('.generated-slug','utf-8').trim(); const post = getPost(slug); console.log('Title:', post?.title); console.log('Archetype:', post?.archetype);"
```

Expected: Title and archetype both printed

- [ ] **Step 7: Commit the generated test post (or discard)**

If the post quality is acceptable, keep it:
```bash
git add "src/content/blog/$(cat .generated-slug).mdx"
git commit -m "content: first archetype-generated blog post ($(cat .generated-slug))"
```

If not, discard it:
```bash
rm "src/content/blog/$(cat .generated-slug).mdx" .generated-slug
```

---

## Execution Notes

- **No test framework exists** in this project. Verification relies on running scripts and inspecting output. All verification steps are manual but explicit.
- **ANTHROPIC_API_KEY required** for Task 7 (end-to-end). Tasks 1-6 can be implemented and verified without it.
- **The auto-blog GitHub Action (`auto-blog.yml`) needs no changes** — it already calls `generate-post.ts`, `auto-fix.ts`, and `quality-check.ts` in sequence. The archetype changes are internal to those scripts.
- **Existing 37 posts are unaffected** — they have no `archetype` field, so all quality checks fall back to legacy defaults (3 H2 minimum, link required).
