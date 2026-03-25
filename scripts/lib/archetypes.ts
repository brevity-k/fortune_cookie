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
  researchPrompt: string;
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
- Treat astrology, fortune-telling, and luck rituals as legitimate cultural practices with real psychological benefits.

DEPTH AND SPECIFICITY REQUIREMENTS (these are non-negotiable):
- Every claim must be grounded in a SPECIFIC named source: a researcher, a place, a date, a number, an event. "Studies show" is banned. "Richard Wiseman's 2003 luck study at the University of Hertfordshire" is correct.
- Use SENSORY DETAIL: what does the place smell like, what does the sound of the machine sound like, what temperature is the oven, what color is the ink on the fortune slip. Show, don't explain.
- Include at least 3 concrete proper nouns per section: names of people, institutions, cities, specific studies, specific dates, specific measurements.
- Prefer vivid anecdotes over abstract explanations. If you can tell a story about a specific person or event, do that instead of summarizing a concept.
- Numbers make writing real: "4.5 million cookies per day", "a two-second folding window", "110 people matched five of six Powerball numbers". Include specific numbers wherever possible.
- NO generic filler sentences like "This is a fascinating topic" or "Many people wonder about..." — every sentence must advance the reader's understanding or emotional experience.`;

const LINK_TARGETS = `Available internal links (use 1-2 where contextually relevant):
- [break a fortune cookie](/) — homepage, interactive cookie
- [daily fortune](/daily) — today's fortune + 7-day history
- [lucky numbers](/lucky-numbers) — daily lucky numbers
- [your horoscope](/horoscope) — horoscope hub
- [Aries daily horoscope](/horoscope/daily/aries) — (substitute any of the 12 signs)
- [zodiac fortune for Scorpio](/zodiac/scorpio) — (substitute any of the 12 signs)
- [love fortunes](/fortune/love) — (substitute: wisdom, career, humor, motivation, philosophy, mystery, adventure)`;

const RESEARCH_PREAMBLE = `You are a research assistant preparing material for a blog post on fortunecrack.com, an interactive fortune cookie website. Your job is to gather SPECIFIC, CONCRETE facts that will make the post feel deeply researched and vivid.

For each fact, provide:
- The specific source (researcher name, institution, year)
- A concrete detail (number, measurement, date, place name)
- A vivid anecdote or story if available

Return ONLY a JSON object with no other text:
{
  "keyFacts": [
    "Fact 1 with specific source and detail",
    "Fact 2 with specific source and detail",
    ...
  ],
  "people": ["Named person 1 and their role", "Named person 2 and their role"],
  "anecdotes": ["A specific story or event with date and place", ...],
  "numbers": ["Specific measurement or statistic with context", ...],
  "sensoryDetails": ["What something looks/smells/sounds/feels like", ...]
}

CRITICAL: Only include facts you are confident are real and verifiable. Do NOT invent researchers, studies, or statistics. If unsure, omit rather than fabricate.`;

export const ARCHETYPES: Archetype[] = [
  {
    name: "midnight-question",
    topicPrompt: `Generate a blog post topic for the "Midnight Question" archetype.
This post opens with a specific emotional moment the reader recognizes (searching for signs, questioning choices, seeking reassurance) and explores it through psychology or culture before landing on a reframe.

The topic should target a question or feeling people actually Google when they're uncertain, anxious, or seeking meaning. Think: "is this a sign", "why do I keep seeing the same number", "what does my fortune cookie mean".`,
    researchPrompt: `${RESEARCH_PREAMBLE}

Research material for a "Midnight Question" post — the kind someone reads alone at midnight looking for reassurance.

Focus your research on:
- Named psychologists or researchers who study the specific emotional state (anxiety, pattern-seeking, meaning-making)
- Specific experiments or findings with dates and sample sizes
- Cultural practices from specific places that address this emotional need
- Real anecdotes or case studies about people experiencing this feeling
- Sensory details of the late-night searching experience`,
    writingPrompt: `${VOICE_PREAMBLE}

You are writing for someone who is alone with their phone at midnight, looking for reassurance that what they're feeling makes sense. Your job is not to teach them something — it's to make them feel understood, and then show them a way of thinking about their experience that they hadn't considered.

Do NOT write like a textbook. Do NOT open with a topic statement. Open with a moment: what the reader is doing, feeling, or thinking right now. Use "you" — put them in the scene. Make the opening so specific that the reader thinks "how did they know?"

The exploration section must go DEEP on 1-2 ideas rather than skimming many. Name the researchers. Describe the experiments. Give the reader specific knowledge they can carry with them — not vague reassurance.

Structure: emotional opening (250-300 words, vivid and specific) -> validation + deep exploration (800-1000 words, 1-2 ideas with named sources, specific studies, real cultural practices) -> the reframe (300-400 words, a genuine perspective shift) -> a closing line that lingers.

Word count: 1,500-2,000 words. Do NOT write fewer than 1,500 words.

Internal links: Only include a link if the reframe naturally connects to fortune-seeking behavior. If it feels forced, skip it entirely.

${LINK_TARGETS}`,
    qualityRules: { h2Minimum: 1, internalLinkRequired: false },
  },
  {
    name: "honest-answer",
    topicPrompt: `Generate a blog post topic for the "Honest Answer" archetype.
This post takes a question people actually Google about fortune cookies, horoscopes, luck, or astrology — and gives the honest middle ground that no other site occupies. Not dismissive ("no, obviously") and not credulous ("yes, here's proof!").

The topic should be a real search query like "do fortune cookies come true", "do horoscopes work", "are zodiac signs real", "is astrology scientifically proven".`,
    researchPrompt: `${RESEARCH_PREAMBLE}

Research material for an "Honest Answer" post — giving the intelligent middle ground on a question about fortune-telling, astrology, or luck.

Focus your research on:
- The actual history behind the practice/belief being questioned (with dates, places, named people)
- Psychological research that explains WHY people engage with this practice (Barnum effect, confirmation bias, etc. — name the researchers)
- Specific experiments or studies with results
- Cultural contexts from specific countries or traditions
- Real stories of the practice having meaningful impact on someone's life
- The strongest arguments both for and against`,
    writingPrompt: `${VOICE_PREAMBLE}

You are answering a question that someone actually typed into Google. They've already seen the dismissive answers and the credulous ones. Give them the honest middle ground — the answer that respects their intelligence.

Open by stating the question plainly. Acknowledge the obvious answer in the first paragraph so the reader knows you're not going to waste their time. Then go deeper — into the SPECIFIC history, the NAMED researchers, the REAL experiments that complicate the simple answer.

The "real answer" section is the heart of the post. It must include:
- At least 2 named researchers or studies with specific findings
- At least 1 historical fact with a date and place
- At least 1 real-world anecdote or example
- A genuine insight the reader hasn't encountered before

Structure: the question + obvious answer (200 words) -> why that's incomplete (250 words) -> the real answer explored in depth (800-1000 words, with named sources and specific evidence) -> the honest conclusion (200 words).

Word count: 1,400-1,800 words. Do NOT write fewer than 1,400 words.

Tone: direct, slightly wry, never condescending. You're the smart friend who gives real answers, not the professor who lectures.

${LINK_TARGETS}`,
    qualityRules: { h2Minimum: 3, internalLinkRequired: true },
  },
  {
    name: "one-thing-deeply",
    topicPrompt: `Generate a blog post topic for the "One Thing, Deeply" archetype.
This post takes a SINGLE specific cultural practice, object, place, or tradition related to fortune-telling, luck, or divination and explores it in rich sensory detail. NOT a survey of multiple cultures — go deep on ONE thing.

Topics like: omikuji (Japanese paper fortunes), the fortune cookie factory in Brooklyn, morijio (Japanese salt piles), nazar amulets, a specific tarot card's history, one Chinese New Year fortune tradition, the I Ching, Tibetan mo divination, Nigerian Ifa divination.`,
    researchPrompt: `${RESEARCH_PREAMBLE}

Research material for a "One Thing, Deeply" post — exploring a single cultural practice, place, or tradition in rich sensory detail.

Focus your research on:
- The specific PLACE where this happens (name the city, the street, the building)
- Named PEOPLE involved (practitioners, makers, historians, founders)
- The step-by-step PROCESS or RITUAL (what happens first, second, third)
- SENSORY details: what it looks like, smells like, sounds like, feels like to touch
- Specific NUMBERS: dimensions, temperatures, quantities, years, prices
- The HISTORY: when did this start, who started it, how has it changed
- A SURPRISING fact or story most people don't know about this tradition`,
    writingPrompt: `${VOICE_PREAMBLE}

You are a travel writer who happens to know a lot about cultural traditions. Write about ONE specific thing in enough detail that the reader feels they've been there.

Open with a single, vivid image — not a thesis statement. Describe what you'd see, hear, or touch. Use specific sensory details: the temperature of the metal, the color of the ink, the sound the paper makes, the scent in the air. The reader should be able to close their eyes and picture the scene.

Then expand outward: where does this tradition come from? Name the founder or the earliest known practitioner. Give specific dates. Describe the ritual or process step by step — what happens first, what tools are used, what words are spoken. What do the practitioners believe, and why?

CRITICAL REQUIREMENTS:
- Name at least 3 specific people, places, or institutions
- Include at least 3 specific numbers (measurements, dates, quantities)
- At least 2 paragraphs should be pure sensory description
- Do NOT survey multiple cultures — go deep on ONE thing
- Include at least one surprising fact or story most people don't know

Structure: vivid opening image (200-250 words) -> the full story/tradition expanded (1000-1200 words with sensory detail, named people, specific facts) -> the universal human need it addresses (200-300 words) -> return to the opening image, transformed (100-150 words).

Word count: 1,500-2,000 words. Do NOT write fewer than 1,500 words.

Internal links: Only if the cultural practice directly involves fortune-telling or luck. Otherwise skip entirely.

${LINK_TARGETS}`,
    qualityRules: { h2Minimum: 1, internalLinkRequired: false },
  },
  {
    name: "counterintuitive-truth",
    topicPrompt: `Generate a blog post topic for the "Counterintuitive Truth" archetype.
This post challenges a widely held belief about luck, fortune, astrology, or positive thinking with evidence that contradicts the conventional wisdom. The goal is a genuine perspective shift, not clickbait contrarianism.

Topics like: "trying to be lucky makes you unlucky", "your bad zodiac traits are your superpowers", "positive thinking can backfire", "superstitions actually work (through psychology)", "the most accurate horoscopes are the ones you don't believe".`,
    researchPrompt: `${RESEARCH_PREAMBLE}

Research material for a "Counterintuitive Truth" post — challenging conventional wisdom about luck, fortune, or positive thinking with specific evidence.

Focus your research on:
- The SPECIFIC conventional wisdom being challenged (state it fairly)
- Named researchers and their specific experiments (Wiseman, Kahneman, Sharot, Seligman, Langer, Dweck, etc.)
- Experiment details: what the participants did, what happened, what the results were (with numbers)
- The psychological MECHANISM that explains why the conventional wisdom is wrong
- Real-world examples or case studies that illustrate the counterintuitive truth
- A specific, actionable takeaway the reader can apply

CRITICAL: Only include well-known, easily verifiable research. If you cannot name the specific study, reframe around well-documented psychological principles.`,
    writingPrompt: `${VOICE_PREAMBLE}

You are writing a piece that will make someone say "I never thought about it that way" and send it to a friend. The goal is a genuine perspective shift, not clickbait contrarianism.

Open by stating the conventional wisdom fairly — don't strawman it. Then present the SPECIFIC evidence that complicates it. This is where depth matters most:
- Name the researcher and their institution
- Describe the actual experiment: what participants did, what happened
- Give the specific results with numbers
- Explain WHY this contradicts the conventional wisdom

The evidence section should read like a story, not a literature review. "Richard Wiseman asked participants to flip through a newspaper and count the photographs. Hidden halfway through, in letters large enough to fill half a page..." — that's the level of detail.

Structure: the belief stated fairly (200 words) -> the complicating evidence (500-700 words, at least 2 specific named studies described in narrative detail) -> why the conventional wisdom fails (300-400 words, the psychological mechanism) -> the counterintuitive conclusion (200 words) -> one specific thing to do differently (150 words).

Word count: 1,400-1,800 words. Do NOT write fewer than 1,400 words.

CRITICAL: Prefer well-known, easily verifiable research (Wiseman, Kahneman, Sharot, Seligman, Langer) over obscure studies. If you cannot cite a specific real study, reframe the argument around well-documented psychological principles instead. Do NOT invent researchers or studies.

${LINK_TARGETS}`,
    qualityRules: { h2Minimum: 3, internalLinkRequired: true },
  },
  {
    name: "list-that-teaches",
    topicPrompt: `Generate a blog post topic for the "List That Teaches" archetype.
This is a numbered list post where every item teaches something genuinely useful. NOT a shallow listicle — each item is a mini-essay with research backing and a specific action the reader can try today.

Topics like: "experiments that make this week feel luckier", "fortune cookie messages that will haunt you", "psychology tricks for better intuition", "morning rituals that actually change your day", "ways to use tarot cards that have nothing to do with predicting the future".`,
    researchPrompt: `${RESEARCH_PREAMBLE}

Research material for a "List That Teaches" post — each item must teach something genuinely useful with research backing.

Focus your research on:
- 7-9 distinct techniques, practices, or insights (more than needed so the writer can choose the best)
- For EACH one: the named researcher or source, the specific finding, and a concrete application
- Surprising or counterintuitive items that the reader wouldn't have thought of
- Specific experiments with memorable details
- Real-world examples of each technique in action
- Avoid generic self-help advice ("be grateful", "think positive") — every item must be specific and non-obvious`,
    writingPrompt: `${VOICE_PREAMBLE}

You are writing a list post where every single item teaches something the reader can use today. This is NOT a listicle — each item is a 200-250 word mini-essay with a specific action the reader can take.

Open with a clear, direct promise (1-2 sentences). Then deliver 7 items, each with:
(a) the idea/technique stated clearly in one punchy sentence
(b) why it works — cite a SPECIFIC researcher or study by name, describe the experiment or finding in 2-3 sentences with concrete details
(c) a specific action the reader can try today or this week, described in enough detail that they could do it right now

Do NOT pad the list with obvious or generic advice ("be more grateful," "think positive"). Every item should make the reader think "I wouldn't have thought of that." If an item could appear in any generic self-help article, replace it with something more specific.

Structure: promise (50-75 words) -> 7 items (200-250 words each, with named sources and specific actions) -> unifying insight (150 words).

Word count: 1,600-2,000 words. Do NOT write fewer than 1,600 words.

${LINK_TARGETS}`,
    qualityRules: { h2Minimum: 3, internalLinkRequired: true },
  },
  {
    name: "timely-transit",
    topicPrompt: `Generate a blog post topic for the "Timely Transit" archetype.
This post covers a specific upcoming astrological event — a full moon, new moon, mercury retrograde, eclipse, equinox, solstice, or major planetary conjunction. It must reference a REAL event with an accurate date.

The post provides practical, grounded guidance for the event period. Think CHANI-style: specific dates, actionable numbered items, warm authority.

Major upcoming events to consider: full moons, new moons, mercury retrogrades, Venus retrogrades, eclipses, equinoxes, solstices, and notable conjunctions in the coming weeks.`,
    researchPrompt: `${RESEARCH_PREAMBLE}

Research material for a "Timely Transit" post — covering a specific upcoming astrological event with practical guidance.

Focus your research on:
- The EXACT event: name, date, time, zodiac sign/degree
- Astrological mechanics: what planets are involved, what aspect they form, what house they transit
- Historical precedents: when did this same transit last occur, what happened culturally or personally
- Psychological resonance: what emotional themes does this transit traditionally surface
- Practical implications by life domain: relationships, career, health, finances, creativity
- 6-8 specific, concrete action items (with dates where applicable)

CRITICAL: Only include astrological events you are confident are real and accurately dated. If unsure of exact timing, use general periods ("late March", "first week of April").`,
    writingPrompt: `${VOICE_PREAMBLE}

You are a trusted astrologer-friend writing about a specific upcoming astrological event. Your reader checks their horoscope daily and wants to know: what does this event mean for MY life, and what should I actually DO about it?

Open with specifics: the event name, exact date, the zodiac sign, and a one-line takeaway that's specific enough to be useful. Then explain what's happening astrologically in plain language — assume the reader knows zodiac signs but not planetary mechanics.

Connect the transit to real life with SPECIFIC, CONCRETE advice:
- "This is a good week to have the conversation you've been avoiding" beats "communication may be highlighted"
- "Postpone signing contracts until after the 15th" beats "be mindful of agreements"
- Reference specific life situations the reader might recognize

Include historical context: when did this same transit last occur? What themes emerged? This grounds the cosmic in the tangible.

Include 6-8 numbered action items. These should be concrete and date-specific where possible. Each action item should be 2-3 sentences explaining what to do and why.

Close with a grounding, human note. Cosmic events are real, but so is the need for rest.

Structure: event + date + sign + takeaway (150 words) -> astrological context explained accessibly with historical precedent (300-400 words) -> real-life implications by domain (400-500 words) -> 6-8 numbered action items (400-500 words, each with specific guidance) -> grounding close (100 words).

Word count: 1,400-1,800 words. Do NOT write fewer than 1,400 words.

CRITICAL: Use real upcoming astrological events with accurate dates. If unsure of exact timing, frame the content around the general period ("late March") rather than fabricating a precise timestamp.

${LINK_TARGETS}`,
    qualityRules: { h2Minimum: 3, internalLinkRequired: true },
  },
];
