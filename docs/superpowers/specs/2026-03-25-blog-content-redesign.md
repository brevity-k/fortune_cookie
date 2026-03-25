# Blog Content Redesign: Emotional Resonance + Traffic Growth

**Date:** 2026-03-25
**Goal:** Redesign the auto-blog pipeline to produce posts that maximize user attraction and meet Google AdSense approval criteria.
**Status:** Design

---

## Problem Statement

The current blog (37 posts) follows a single template: SEO-friendly hook, 4-6 H2 sections of researched facts, tie-back to fortunecrack.com. The posts are structurally sound but:

1. **Indistinguishable from content-mill output** — no voice, no emotional depth, no surprising perspective
2. **Penalized by Google's Helpful Content Update** — content written for search engines rather than people gets demoted
3. **Low engagement signals** — uniform tone produces high bounce rates and low time-on-page, which hurts AdSense approval
4. **No content differentiation** — nothing a reader can get here that they can't get from 50 other sites

### AdSense Approval Requirements (Relevant)

- Original, substantial content that adds value
- Good user experience (low bounce rate, reasonable session duration)
- Regular content updates (already met via auto-blog pipeline)
- Sufficient content volume (already met with 37+ posts)
- E-E-A-T signals (Experience, Expertise, Authoritativeness, Trustworthiness)

The bottleneck is content quality and engagement, not volume.

---

## Solution: Archetype-Based Post Generation

Replace the single post template with **six distinct archetypes**, each with a different emotional structure. The auto-blog pipeline rotates through archetypes, producing structurally varied content that reads like it was written by a human with a perspective.

### Voice: The "Knowledgeable Friend" Standard

**Reference:** CHANI (chani.com) — the gold standard for astrology/spirituality content that treats readers as intelligent adults.

All archetypes share a baseline voice:

- **Warm authority, not academic authority.** Write like a trusted friend who knows things, not a researcher presenting findings. "Here's the thing most people get wrong" beats "A 2016 study published in *Organizational Behavior*..."
- **Research supports, never leads.** When citing studies, weave them into the narrative naturally. Never open a section with "Research by Dr. X at Y University found that..." Instead: "Lucky people aren't hustlers — they're relaxed. Richard Wiseman spent a decade proving this."
- **Intellectual honesty.** Acknowledge uncertainty: "Maybe — that's always possible." Refuse binary answers. Entertain contradiction. Never apologize for the subject matter or add "for entertainment purposes only."
- **Practical grounding.** Every mystical or psychological concept must land in something the reader can *do* or *feel*. "Sometimes you just need a nap, a snack, or some space" is a valid conclusion.
- **Treat the reader as a capable adult.** No condescension, no over-explanation, no "you might be wondering..." filler. Assume they're curious and smart.

### Design Principles

1. **Lead with a recognizable emotion, not a topic** — the reader should see themselves in the first paragraph
2. **Research serves the story, not the other way around** — cite studies to support an insight, don't organize posts around studies
3. **Every post needs one genuine surprise** — a reframe, a counterintuitive finding, a perspective shift the reader didn't expect
4. **Internal links go to specific pages** — link to `/horoscope/daily/[sign]`, `/zodiac/[sign]`, `/daily`, `/lucky-numbers`, `/fortune/[category]` where contextually relevant, not just the homepage. These pages exist and improve session depth.
5. **Structural variety signals human authorship** — Google's classifiers and human readers both notice when every post follows the same shape
6. **Commit to the subject matter** — astrology, fortune-telling, and luck rituals are treated as legitimate cultural practices with real psychological benefits. No hedging, no "just for fun" disclaimers.

---

## The Six Archetypes

### Archetype 1: "The Midnight Question"

**Purpose:** Capture high-intent emotional search queries (people Googling feelings, not facts).

**Structure:**
1. Open with a hyper-specific emotional moment the reader recognizes (2nd person, present tense)
2. Name the feeling and validate it — "you're not crazy for feeling this"
3. Explore *why* we feel this through 1-2 cultural or psychological lenses (not a survey of 6 sources — go deep on 1-2)
4. Land on a reframe that genuinely shifts how the reader thinks about the experience
5. Close with a single sentence that stays with the reader

**Voice:** Intimate, slightly literary. Second person. Short paragraphs. No listicle energy.

**Word count:** 1,200-1,800 words

**Internal link strategy:** Weave in naturally only if the reframe connects to fortune-seeking behavior. Skip if forced.

**Prompt guidance for Stage 2:**
```
You are writing for someone who is alone with their phone at midnight, looking for
reassurance that what they're feeling makes sense. Your job is not to teach them
something — it's to make them feel understood, and then show them a way of thinking
about their experience that they hadn't considered.

Do NOT write like a textbook. Do NOT open with a topic statement. Open with a moment:
what the reader is doing, feeling, or thinking right now. Use "you" — put them in the scene.

Structure: emotional opening (200 words) -> validation + exploration (600-800 words,
going deep on 1-2 ideas rather than skimming many) -> the reframe (200-300 words) ->
a closing line that lingers.
```

---

### Archetype 2: "The Honest Answer"

**Purpose:** Capture question-based search queries and own the "honest middle ground" that no other site occupies.

**Structure:**
1. State the question the reader actually Googled
2. Give the obvious answer and acknowledge it immediately ("Let's get this out of the way: no, fortune cookies don't have magical powers")
3. Explain why the obvious answer is incomplete — what it misses
4. Explore the real, more interesting answer through psychology/culture/story
5. Deliver a final honest answer that the reader can actually use

**Voice:** Direct, slightly wry, respectful of both skeptics and believers. Treats the reader as intelligent.

**Word count:** 1,000-1,500 words

**Internal link strategy:** Natural — these posts often discuss fortune cookies directly.

**Prompt guidance for Stage 2:**
```
You are answering a question that someone actually typed into Google. They've already
seen the dismissive answers ("no, obviously") and the credulous ones ("yes, here's proof!").
Give them the honest middle ground — the answer that respects their intelligence.

Open by stating the question plainly. Acknowledge the obvious answer in the first paragraph
so the reader knows you're not going to waste their time. Then go deeper.

Structure: the question + obvious answer (150 words) -> why that's incomplete (200 words)
-> the real answer explored in depth (600-800 words) -> the honest conclusion (150 words).

Tone: direct, slightly wry, never condescending. You're the smart friend who gives
real answers, not the professor who lectures.
```

---

### Archetype 3: "One Thing, Deeply"

**Purpose:** Cultural depth pieces that make the reader feel they've traveled somewhere. Target long-tail cultural keywords.

**Structure:**
1. Open with a single vivid image — a specific place, object, or moment described in sensory detail
2. Expand outward from that image into the full story/tradition/practice
3. Include the specific details that make the reader feel present (names, textures, sequences, sounds)
4. Connect the tradition to a universal human need the reader recognizes in themselves
5. Close by returning to the opening image, now transformed by what the reader has learned

**Voice:** Narrative, sensory, almost travel-writing. Slow pace. No bullet points.

**Word count:** 1,200-1,800 words

**Internal link strategy:** Only if the cultural practice directly involves fortune-telling or luck rituals. Otherwise skip.

**Prompt guidance for Stage 2:**
```
You are a travel writer who happens to know a lot about cultural traditions. Write about
ONE specific thing in enough detail that the reader feels they've been there.

Open with a single, vivid image — not a thesis statement. Describe what you'd see, hear,
or touch. Then expand outward: where does this tradition come from? What does the ritual
look like step by step? What do the practitioners believe, and why?

Do NOT survey multiple cultures in one post. Go deep on ONE. Use specific names, places,
textures, and sequences. A reader should be able to close their eyes and picture the scene.

Structure: vivid opening image (150 words) -> the full story/tradition expanded (800-1000
words with sensory detail) -> the universal human need it addresses (200 words) -> return
to the opening image, transformed (100 words).
```

---

### Archetype 4: "The Counterintuitive Truth"

**Purpose:** High-shareability pieces that challenge conventional wisdom. Strong social traffic potential.

**Structure:**
1. Open with the widely held belief stated clearly and fairly
2. Present the evidence that complicates or contradicts it (specific research, not vague claims)
3. Explain *why* the conventional wisdom is wrong — what mechanism people misunderstand
4. Deliver the counterintuitive conclusion with enough supporting evidence that it's convincing
5. Close with one actionable implication — what the reader should do differently now

**Voice:** Confident but not arrogant. "Here's what I found" not "you've been lied to." Conversational authority.

**Word count:** 1,000-1,500 words

**Internal link strategy:** Link where the counterintuitive truth connects to fortune/luck-seeking behavior.

**Prompt guidance for Stage 2:**
```
You are writing a piece that will make someone say "I never thought about it that way"
and send it to a friend. The goal is a genuine perspective shift, not clickbait contrarianism.

Open by stating the conventional wisdom fairly — don't strawman it. Then present specific
evidence (name the researcher, cite the study, describe the experiment) that complicates
or contradicts it. Explain the mechanism — why does the conventional wisdom get it wrong?

Structure: the belief stated fairly (150 words) -> the complicating evidence (400-500
words, specific studies) -> why the conventional wisdom fails (200-300 words) -> the
counterintuitive conclusion (200 words) -> one thing to do differently (100 words).

CRITICAL: The contrarian claim must be backed by real, specific research. Do not invent
studies or researchers. If you cannot cite a real study, reframe the argument around
well-documented psychological principles instead.
```

---

### Archetype 5: "The List That Teaches"

**Purpose:** Scannable format with genuine depth per item. Best for actionable/practical keywords.

**Structure:**
1. Open with a clear promise: what the reader will be able to do after reading this
2. Each list item (5-7 items) includes: the technique/idea, the research behind it, and a specific thing to try today
3. No filler items — every entry must deliver genuine value
4. Close with a single unifying insight that ties the items together

**Voice:** Energetic, practical, slightly coach-like. "Try this" not "studies show."

**Word count:** 1,200-1,800 words

**Internal link strategy:** Link fortunecrack.com as one of the actionable suggestions where it fits naturally.

**Prompt guidance for Stage 2:**
```
You are writing a list post where every single item teaches something the reader can
use today. This is NOT a listicle — each item is a 150-200 word mini-essay with a
specific action the reader can take.

Open with a clear, direct promise (1-2 sentences). Then deliver 5-7 items, each with:
(a) the idea/technique stated clearly, (b) why it works (cite research or explain the
mechanism in 1-2 sentences), (c) a specific action the reader can try today or this week.

Do NOT pad the list with obvious or generic advice ("be more grateful," "think positive").
Every item should make the reader think "I wouldn't have thought of that."

Structure: promise (50 words) -> 5-7 items (150-200 words each) -> unifying insight (100 words).
```

---

### Archetype 6: "The Timely Transit"

**Purpose:** Capture time-sensitive search traffic around specific astrological events (full moons, retrogrades, eclipses, conjunctions, seasonal shifts). This is the highest-intent astrology traffic because people search these terms *right now* when the event is approaching.

**Reference model:** CHANI (chani.com) — event-driven astrology posts with specific dates, actionable guidance, and practical grounding. Also inspired by Lee Dong-heon's saju consulting: outcome-driven, mentor stance, connecting celestial timing to real life decisions.

**Structure:**
1. Open with the specific event: what it is, when it happens (exact date/time), and a one-line "what this means for you"
2. Explain the astrological context in accessible terms — assume the reader knows their sign but not planetary mechanics
3. Connect the event to real-life domains (relationships, career, health, decisions) with specific, practical guidance
4. Include 5-8 numbered action items ("things to do / not do during this transit")
5. Close with a grounding note — "sometimes you just need a nap, a snack, or some space"

**Voice:** Warm authority. Mentor, not professor. Specific dates and practical advice, not vague mysticism. Treats astrology as a legitimate framework for timing decisions.

**Word count:** 1,000-1,500 words

**Internal link strategy:** Required — link to relevant `/horoscope/daily/[sign]` or `/zodiac/[sign]` pages. These posts are the natural bridge between blog content and the horoscope section.

**Prompt guidance for Stage 2:**
```
You are a trusted astrologer-friend writing about a specific upcoming astrological event.
Your reader checks their horoscope daily and wants to know: what does this event mean
for MY life, and what should I actually DO about it?

Open with specifics: the event name, exact date, and a one-line takeaway. Then explain
what's happening astrologically in plain language — assume the reader knows zodiac signs
but not planetary mechanics.

Connect the transit to real life: relationships, career decisions, energy levels, timing.
Be specific and practical, not vague. "This is a good week to have the conversation
you've been avoiding" beats "communication may be highlighted."

Include 5-8 numbered action items. These should be concrete: "postpone signing contracts
until after the 15th" not "be mindful of agreements."

Close with a grounding, human note. Cosmic events are real, but so is the need for rest.

Structure: event + date + takeaway (100 words) -> astrological context explained
accessibly (200-300 words) -> real-life implications by domain (300-400 words) ->
5-8 numbered action items (300-400 words) -> grounding close (50 words).

CRITICAL: Use real upcoming astrological events with accurate dates. Do not invent
planetary positions. If unsure of exact timing, frame the content around the general
period (e.g., "late March 2026") rather than fabricating a precise timestamp.
```

**Pipeline note:** Timely Transit posts are time-sensitive and should be published 3-7 days before the event. The auto-blog pipeline should schedule these based on an astrological event calendar (major events: equinoxes, solstices, retrogrades, eclipses, full/new moons). This may require a separate trigger or event list rather than pure rotation.

---

## Twelve Initial Post Concepts

These serve as both the first batch of posts and as examples for the archetype system.

### Midnight Question

| # | Title | Target Keyword | Archetype |
|---|-------|---------------|-----------|
| 1 | Why You Keep Looking for Signs (And Why That's Not Crazy) | "is this a sign from the universe" | Midnight Question |
| 2 | What Your Fortune Cookie Is Really Telling You | "what does my fortune cookie mean" | Midnight Question |

### Honest Answer

| # | Title | Target Keyword | Archetype |
|---|-------|---------------|-----------|
| 3 | Do Fortune Cookies Actually Come True? (The Real Answer) | "do fortune cookies come true" | Honest Answer |
| 4 | Your Horoscope Isn't Predicting Your Future — It's Doing Something More Useful | "do horoscopes work" | Honest Answer |

### One Thing, Deeply

| # | Title | Target Keyword | Archetype |
|---|-------|---------------|-----------|
| 5 | Omikuji: The Japanese Fortune Tradition That Teaches You What to Do With Bad Luck | "omikuji", "japanese fortune" | One Thing, Deeply |
| 6 | The Woman Who Writes 10,000 Fortunes a Year (Inside the Fortune Cookie Industry) | "who writes fortune cookies" | One Thing, Deeply |

### Counterintuitive Truth

| # | Title | Target Keyword | Archetype |
|---|-------|---------------|-----------|
| 7 | Stop Trying to Be Lucky — Why the Luckiest People Aren't Trying at All | "how to be lucky" | Counterintuitive Truth |
| 8 | Why Your 'Bad' Zodiac Traits Are Actually Your Superpowers | "worst zodiac traits" | Counterintuitive Truth |

### List That Teaches

| # | Title | Target Keyword | Archetype |
|---|-------|---------------|-----------|
| 9 | 7 Tiny Experiments That Will Make This Week Feel Luckier | "how to feel luckier" | List That Teaches |
| 10 | 5 Fortune Cookie Messages That Sound Simple but Will Haunt You | "best fortune cookie messages" | List That Teaches |

### Timely Transit

| # | Title | Target Keyword | Archetype |
|---|-------|---------------|-----------|
| 11 | April 2026 Full Moon in Libra: What It Means for Your Relationships and What to Do About It | "full moon april 2026", "full moon in libra" | Timely Transit |
| 12 | Mercury Retrograde April 2026: The Honest Guide (What Actually Matters and What Doesn't) | "mercury retrograde april 2026" | Timely Transit |

---

## Pipeline Integration

### Changes to `scripts/generate-post.ts`

#### 1. Replace `CONTENT_PILLARS` with `ARCHETYPES`

The current pillar rotation (`existingFiles.length % CONTENT_PILLARS.length`) is replaced with archetype rotation. Each archetype includes its own topic generation prompt and writing prompt.

```
ARCHETYPES = [
  { name: "midnight-question", topicPrompt: "...", writingPrompt: "..." },
  { name: "honest-answer", topicPrompt: "...", writingPrompt: "..." },
  { name: "one-thing-deeply", topicPrompt: "...", writingPrompt: "..." },
  { name: "counterintuitive-truth", topicPrompt: "...", writingPrompt: "..." },
  { name: "list-that-teaches", topicPrompt: "...", writingPrompt: "..." },
  { name: "timely-transit", topicPrompt: "...", writingPrompt: "..." },
]
```

Rotation: `existingFiles.length % ARCHETYPES.length`

#### 2. Stage 1 (Topic Selection) — Archetype-Aware

The topic prompt changes per archetype. Instead of asking for any topic in a content pillar, it asks for a topic that fits the archetype's emotional structure.

Example for "Midnight Question":
```
Generate a blog post topic for the "Midnight Question" archetype.
This post opens with a specific emotional moment the reader recognizes
(searching for signs, questioning choices, seeking reassurance) and
explores it through psychology or culture before landing on a reframe.

The topic should target a question or feeling people actually Google
when they're uncertain, anxious, or seeking meaning.
```

#### 3. Stage 2 (Writing) — Archetype-Specific Prompts

Each archetype has its own writing prompt (detailed in the archetype sections above). The key change: the writing prompt defines the *structure and voice*, not just the topic and word count.

#### 4. Frontmatter Addition

Add an `archetype` field to the frontmatter so posts can be categorized and analyzed:

```yaml
---
title: "Why You Keep Looking for Signs"
date: "2026-03-25"
readTime: "7 min read"
excerpt: "..."
archetype: "midnight-question"
---
```

### Changes to `scripts/quality-check.ts`

The quality check must read the `archetype` field from frontmatter and adjust validation rules accordingly.

**Per-archetype H2 minimum:**

| Archetype | H2 Minimum | Rationale |
|-----------|-----------|-----------|
| midnight-question | 1 | Literary/narrative structure; forced section breaks undermine the voice |
| honest-answer | 3 | Clear sections (obvious answer, deeper answer, conclusion) |
| one-thing-deeply | 1 | Continuous narrative flow; headings optional |
| counterintuitive-truth | 3 | Needs structure: belief, evidence, conclusion |
| list-that-teaches | 3 | List items are natural H2s |
| timely-transit | 3 | Event context, life implications, action items are natural sections |

**Per-archetype internal link check:**

| Archetype | Internal link required? | Rationale |
|-----------|----------------------|-----------|
| midnight-question | Warning only (not a hard fail) | Link only if the reframe naturally connects to fortune-seeking |
| honest-answer | Required (hard fail) | These posts discuss fortune cookies/horoscopes directly |
| one-thing-deeply | Warning only (not a hard fail) | Link only if the cultural practice involves fortune-telling |
| counterintuitive-truth | Required (hard fail) | Usually connects to luck/fortune behavior |
| list-that-teaches | Required (hard fail) | fortunecrack.com fits naturally as one actionable suggestion |
| timely-transit | Required (hard fail) | Natural bridge to horoscope pages (`/horoscope/daily/[sign]`) |

**Internal link targets:** Posts should link to specific site pages where contextually relevant, not just the homepage. Available targets:
- `/horoscope/daily/[sign]` — 12 daily horoscope pages
- `/horoscope/weekly/[sign]` — 12 weekly horoscope pages
- `/zodiac/[sign]` — 12 zodiac fortune pages
- `/daily` — daily fortune page
- `/lucky-numbers` — lucky numbers page
- `/fortune/[category]` — 8 category pages (wisdom, love, career, humor, etc.)
- `/` — homepage (break a fortune cookie)

**Archetype-specific AI review criteria:**
- Midnight Question: Does the opening create emotional recognition? Is there a genuine reframe?
- Honest Answer: Does it acknowledge the obvious answer first? Is the real answer surprising?
- One Thing, Deeply: Does it stay focused on one subject? Are there sensory details?
- Counterintuitive Truth: Is the contrarian claim supported by specific evidence? (Prefer well-known, easily verifiable research — e.g., Wiseman, Kahneman, Sharot — since the AI reviewer cannot reliably distinguish real citations from fabricated ones.)
- List That Teaches: Does every item include a specific action?
- Timely Transit: Does it reference a real astrological event with an accurate date? Are the action items concrete and practical?

**Word count ranges:** Enforced via prompt guidance only. The quality check minimum of 600 words remains unchanged as a safety floor. Per-archetype ranges are not hard-checked because prompt structure constraints naturally keep word counts in range.

### Changes to `scripts/auto-fix.ts`

The auto-fix script runs between generation and quality check in `auto-blog.yml`. Two changes needed:

1. **Trailing-sentence trimmer (Fix 7):** Must be archetype-aware. Archetypes "midnight-question" and "one-thing-deeply" may use stylistic endings (em-dashes, ellipses) that the trimmer would incorrectly truncate. When `archetype` is one of these two, the trimmer should accept endings with em-dashes and ellipses as valid, not truncate them. The "timely-transit" archetype uses standard endings and needs no special handling.

2. **H1-to-H2 conversion:** Remains unchanged (applies to all archetypes).

3. **All other fixes** (frontmatter repair, whitespace cleanup): Remain unchanged and are compatible with the new archetypes.

### Changes to `scripts/validate-content.ts`

The `archetype` frontmatter field is **optional** for existing posts and **required** for new posts generated by the updated pipeline. Since `validate-content.ts` validates all blog posts including existing ones, `archetype` should NOT be added to the required fields list. Instead, add a soft validation: if `archetype` is present, verify it is one of the six valid values (`midnight-question`, `honest-answer`, `one-thing-deeply`, `counterintuitive-truth`, `list-that-teaches`, `timely-transit`).

### Changes to `src/lib/blog.ts`

Add `archetype?: string` to the `BlogPost` interface as an optional field. Update `parseBlogPost` to pass through the `archetype` field from frontmatter when present. No frontend feature consumes this field yet, but it enables future features (filtering by archetype, analytics) without a second migration.

### Internal Linking Strategy

Each new post includes **1-2 internal links** to specific fortunecrack.com pages (not just the homepage). The Stage 2 prompt receives a list of available link targets:

```
Available internal links (use 1-2 where contextually relevant):
- [break a fortune cookie](/) — homepage, interactive cookie
- [daily fortune](/daily) — today's fortune + 7-day history
- [lucky numbers](/lucky-numbers) — daily lucky numbers
- [your horoscope](/horoscope) — horoscope hub
- [Aries daily horoscope](/horoscope/daily/aries) — (substitute any sign)
- [zodiac fortune for Scorpio](/zodiac/scorpio) — (substitute any sign)
- [love fortunes](/fortune/love) — (substitute: wisdom, career, humor, motivation, philosophy, mystery, adventure)
```

The link must fit the content naturally. Timely Transit posts should link to the relevant horoscope pages. Midnight Question posts about zodiac topics should link to zodiac pages. Generic posts link to the homepage or daily fortune.

**Cross-linking between blog posts (deferred to future scope).** Defer until the archetype system is proven and stable.

---

## Success Metrics

| Metric | Current (estimated) | Target | How Measured |
|--------|-------------------|--------|-------------|
| Avg. time on page | ~1.5 min | 3+ min | Google Analytics |
| Bounce rate (blog) | ~70% | <55% | Google Analytics |
| Pages per session | ~1.3 | 2+ | Google Analytics |
| AdSense approval | Not approved | Approved | Google AdSense dashboard |
| Organic blog traffic | Baseline (unknown) | 2x in 90 days | Google Search Console |

---

## Implementation Scope

### In Scope
- Refactor `scripts/generate-post.ts` to support archetype rotation with archetype-specific prompts
- Update Stage 1 (topic selection) and Stage 2 (writing) prompts for all 6 archetypes
- Add `archetype` field to post frontmatter
- Update `scripts/quality-check.ts` with archetype-aware evaluation (per-archetype H2 minimums, internal link checks, AI review criteria)
- Update `scripts/auto-fix.ts` trailing-sentence trimmer to be archetype-aware
- Update `scripts/validate-content.ts` to soft-validate the `archetype` field
- Add `archetype?: string` to `BlogPost` interface in `src/lib/blog.ts`
- Generate the first 12 posts using the new system (2 per archetype)

### Out of Scope
- Rewriting existing 37 blog posts (leave as-is; new posts will dilute them over time)
- Changes to blog layout/design (separate initiative)
- Changes to other auto-generation pipelines (fortunes, horoscopes, seasonal)
- Interactive embedded components (Approach C — deferred)
- Cross-linking between blog posts (deferred until archetype system is proven)

---

## Risks

| Risk | Mitigation |
|------|-----------|
| AI-generated posts still sound formulaic despite new prompts | The archetype-specific voice instructions are much more constraining than the current generic prompt. Quality check catches posts that revert to default AI voice. |
| Counterintuitive Truth posts cite fabricated research | Prompt instructs: prefer well-known, easily verifiable research (Wiseman, Kahneman, Sharot, Seligman) over obscure studies. Fallback: reframe around well-documented psychological principles. Note: the AI quality reviewer cannot reliably detect fabricated citations — this is a known limitation of LLM pipelines. |
| Posts become too long (1,800 words) for engagement | Each archetype specifies a word count range. The writing prompt structures prevent rambling by defining section lengths. |
| Archetype rotation produces topic repetition | Topic selection prompt includes full list of existing titles. Slug collision retry already exists. |
| Timely Transit posts have incorrect astrological dates | Prompt instructs to use real events with accurate dates, and to fall back to general period ("late March") if uncertain. Quality check flags posts without specific dates. Major astrological events (equinoxes, retrogrades, eclipses) have well-known dates that LLMs typically get right. |
| Timely Transit posts become stale after the event passes | These posts still capture long-tail search traffic ("full moon libra 2026") for months after. No action needed — stale transits naturally age out of search rankings. |
