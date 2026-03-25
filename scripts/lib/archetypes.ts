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
