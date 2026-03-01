import type { Metadata } from "next";
import Link from "next/link";
import {
  CATEGORIES,
  FortuneCategory,
  getFortunesByCategory,
  seededRandom,
  dateSeed,
  getRarityColor,
  getRarityLabel,
} from "@/lib/fortuneEngine";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const revalidate = 43200; // 12 hours — refresh at least twice daily

const categoryDescriptions: Record<FortuneCategory, string> = {
  wisdom: "Timeless wisdom and profound insights to guide your journey through life.",
  love: "Heartfelt fortunes about love, relationships, and matters of the heart.",
  career: "Fortune cookie messages about work, ambition, and professional success.",
  humor: "Lighthearted and funny fortune cookie messages to brighten your day.",
  motivation: "Inspiring fortunes to fuel your drive and keep you moving forward.",
  philosophy: "Deep philosophical fortunes that challenge your perspective on life.",
  adventure: "Bold fortunes encouraging you to explore, take risks, and seek new experiences.",
  mystery: "Enigmatic and mysterious fortunes that spark wonder and curiosity.",
};

const categoryFAQs: Record<FortuneCategory, { q: string; a: string }[]> = {
  wisdom: [
    { q: "What are wisdom fortune cookies?", a: "Wisdom fortune cookies contain timeless proverbs and insights drawn from traditions around the world. They offer thoughtful guidance for everyday decisions." },
    { q: "How often do wisdom fortunes change?", a: "Our featured wisdom fortunes rotate daily using a date-based system, so everyone sees the same selection each day. Come back tomorrow for fresh wisdom." },
    { q: "How many wisdom fortunes are there?", a: "We have 200 curated wisdom fortunes in our collection, each one carefully selected for its depth and relevance." },
  ],
  love: [
    { q: "What are love fortune cookies?", a: "Love fortune cookies contain messages about romance, relationships, and emotional connections. They range from sweet to profound." },
    { q: "Can I share my love fortune?", a: "Yes! Break a fortune cookie on our homepage and share your love fortune on Twitter, Facebook, WhatsApp, or copy it to your clipboard." },
    { q: "How many love fortunes are available?", a: "Our collection includes 150 unique love fortunes, covering everything from new romance to lasting partnerships." },
  ],
  career: [
    { q: "What are career fortune cookies?", a: "Career fortune cookies offer motivational messages about work, professional growth, and achieving your ambitions." },
    { q: "Are career fortunes good for Monday motivation?", a: "Absolutely! Many people check their career fortune at the start of the week for a boost of professional inspiration." },
    { q: "How many career fortunes exist?", a: "We have 150 career-focused fortunes covering success, ambition, teamwork, and professional wisdom." },
  ],
  humor: [
    { q: "What are funny fortune cookies?", a: "Humor fortune cookies contain witty, playful, and lighthearted messages designed to make you smile or laugh." },
    { q: "Are the humor fortunes family-friendly?", a: "Yes, all our humor fortunes are clean and family-friendly — perfect for sharing with anyone." },
    { q: "How many funny fortunes are there?", a: "Our humor collection features 150 unique funny fortunes, from clever wordplay to unexpected punchlines." },
  ],
  motivation: [
    { q: "What are motivation fortune cookies?", a: "Motivation fortune cookies deliver inspiring messages to fuel your drive, boost confidence, and encourage action." },
    { q: "Can I get a daily motivational fortune?", a: "Yes! Visit our daily fortune page every day for a fresh motivational message powered by our seeded random system." },
    { q: "How many motivational fortunes are available?", a: "We have 150 motivational fortunes designed to inspire action and positive thinking." },
  ],
  philosophy: [
    { q: "What are philosophy fortune cookies?", a: "Philosophy fortune cookies contain thought-provoking messages that challenge your perspective and invite deeper reflection." },
    { q: "What makes philosophy fortunes different from wisdom?", a: "While wisdom fortunes offer practical life guidance, philosophy fortunes explore abstract concepts like existence, truth, and meaning." },
    { q: "How many philosophy fortunes exist?", a: "Our collection includes 101 philosophy fortunes, each one crafted to spark contemplation." },
  ],
  adventure: [
    { q: "What are adventure fortune cookies?", a: "Adventure fortune cookies contain bold messages encouraging you to explore, take risks, and embrace new experiences." },
    { q: "Are adventure fortunes good for travelers?", a: "Absolutely! Many people crack an adventure fortune before a trip for an extra dose of wanderlust and courage." },
    { q: "How many adventure fortunes are there?", a: "We have 80 unique adventure fortunes that celebrate exploration, courage, and the thrill of the unknown." },
  ],
  mystery: [
    { q: "What are mystery fortune cookies?", a: "Mystery fortune cookies contain enigmatic and cryptic messages that spark curiosity and invite interpretation." },
    { q: "Why are mystery fortunes so rare?", a: "Mystery fortunes are our legendary rarity tier — the hardest to find. Their scarcity makes each one feel special." },
    { q: "How many mystery fortunes exist?", a: "We have 50 carefully crafted mystery fortunes, making them our rarest and most exclusive category." },
  ],
};

const CATEGORY_DESCRIPTIONS: Record<FortuneCategory, string> = {
  wisdom:
    "Wisdom fortune cookies draw from centuries of human insight, distilling the teachings of Eastern and Western philosophical traditions into brief, memorable phrases. Rooted in the Confucian, Taoist, and Buddhist proverbs that inspired the earliest fortune cookie messages in early twentieth-century America, these fortunes carry forward a long lineage of oral wisdom. They touch on patience, self-knowledge, humility, and the art of living well. What makes wisdom fortunes resonate so deeply is their universality — a single sentence about letting go or embracing change can feel startlingly relevant to someone facing a career crossroads, a difficult relationship, or an ordinary Tuesday afternoon. These messages work because they bypass analytical thinking and speak directly to lived experience. A good wisdom fortune does not lecture; it offers a gentle reframe that lingers in the mind long after the cookie is cracked.",

  love:
    "Love fortune cookies explore the full spectrum of human connection — the flutter of new attraction, the quiet comfort of long partnership, the courage required to be vulnerable, and the resilience needed after heartbreak. The tradition of seeking romantic guidance from oracles, astrologers, and divination tools stretches back thousands of years, from the love poetry of Rumi to the matchmaking rituals of ancient China. Fortune cookies inherited this impulse and made it casual and accessible. Love fortunes resonate because romantic uncertainty is one of the most universal human experiences; a short, hopeful message can provide reassurance when someone is deciding whether to confess feelings, repair a rift, or simply appreciate what they already have. The best love fortunes avoid sentimentality and instead capture an emotional truth — the kind of line you might underline in a novel and carry in your wallet.",

  career:
    "Career fortune cookies address the ambitions, anxieties, and daily realities of professional life. They draw on a rich tradition of proverbial guidance about hard work, opportunity, and perseverance found in cultures worldwide — from the industriousness celebrated in Benjamin Franklin's Poor Richard's Almanack to the Confucian emphasis on self-cultivation through disciplined effort. In the context of fortune cookies, career messages serve as miniature pep talks that arrive at exactly the right moment: before a job interview, during a difficult project, or in the quiet doubt of wondering whether your work matters. These fortunes resonate because work occupies a central place in modern identity, and a concise, well-timed reminder about patience, leadership, or creative risk-taking can shift someone's mindset for the rest of the day. The most effective career fortunes balance aspiration with realism, acknowledging struggle while pointing toward growth.",

  humor:
    "Humor fortune cookies honor the playful, irreverent side of the fortune cookie tradition. While many people associate fortune cookies with solemn proverbs, humor has always been part of the experience — from intentionally absurd predictions to fortunes that break the fourth wall. Comedy in fortune cookies draws on the long human tradition of using laughter as wisdom delivery: Aesop's fables used wit to teach morals, Zen masters told jokes to trigger insight, and court jesters spoke truths that advisors could not. A funny fortune works because it defuses the pretense of prophecy while still offering a small, genuine moment of delight. The surprise of unfolding a cookie and finding something that makes you laugh out loud is memorable in a way that earnest advice sometimes is not. Humor fortunes remind us that joy itself is a form of good fortune, and that not every message needs to be profound to be meaningful.",

  motivation:
    "Motivation fortune cookies tap into the human need for encouragement at moments of doubt, fatigue, or indecision. This category inherits a tradition that runs from ancient Stoic exercises in mental resilience through modern positive psychology research on self-efficacy and growth mindset. The power of a motivational fortune lies in its brevity and timing — a single sentence urging you to persist, to start, or to believe in your capacity for change can function like a psychological nudge at a pivotal moment. Research on implementation intentions and affirmations suggests that short, concrete statements of possibility genuinely influence behavior. Motivational fortunes resonate because they meet people in the gap between intention and action, offering not a plan but a push. The best ones avoid hollow cheerfulness and instead name the difficulty honestly before pointing toward what lies on the other side of effort and persistence.",

  philosophy:
    "Philosophy fortune cookies condense millennia of human inquiry into thought-provoking fragments. They draw from the traditions of Socratic questioning, existentialist reflection, Zen koans, and Taoist paradox — all modes of thinking that use brevity and surprise to unsettle habitual assumptions. Unlike wisdom fortunes, which tend to offer guidance, philosophy fortunes ask questions or present ideas that resist easy resolution: the nature of time, the paradox of choice, the relationship between self and other. This category connects to the ancient practice of philosophical aphorisms, from Heraclitus and Epictetus to Nietzsche and Wittgenstein, where a single sentence could reorient an entire worldview. Philosophy fortunes resonate because they invite active participation — the reader must sit with the idea, turn it over, and decide what it means. They appeal to people who enjoy intellectual play and who find comfort not in answers but in the quality of the questions themselves.",

  adventure:
    "Adventure fortune cookies speak to the restless, curious part of human nature that longs for novelty, exploration, and the thrill of the unfamiliar. This category draws from a deep cultural wellspring — the hero's journey described by Joseph Campbell, the wanderlust poetry of Basho and Whitman, and the traveler traditions of cultures from the Polynesian wayfinders to the Silk Road merchants. Adventure fortunes encourage stepping beyond the boundaries of routine, whether that means booking a trip, trying a new skill, or simply taking an unfamiliar route home. They resonate because modern life, for all its comforts, often feels constrained, and a brief, bold message about embracing the unknown can rekindle a sense of possibility. The most compelling adventure fortunes balance excitement with depth, suggesting that the real discovery is not the destination but the transformation that comes from saying yes to uncertainty.",

  mystery:
    "Mystery fortune cookies occupy the most enigmatic corner of the fortune cookie tradition, offering cryptic messages that resist immediate interpretation. They connect to humanity's oldest relationship with the unknown — the oracle at Delphi delivering ambiguous prophecies, the I Ching presenting hexagrams that demand contemplation, and the tarot reader laying out symbols that mean different things to different seekers. Mystery fortunes are deliberately open-ended; they work not by providing clarity but by creating a space for the reader's own intuition to surface. This category resonates because certainty is rarer than we pretend, and there is genuine comfort in a message that acknowledges the unknowable rather than papering over it with false confidence. A mysterious fortune invites you to sit with ambiguity, to notice what your mind reaches for when given an incomplete map. These are the fortunes people photograph, share, and return to — precisely because their meaning keeps shifting as the reader's life unfolds.",
};

const CATEGORY_CULTURAL_CONTEXT: Record<FortuneCategory, { title: string; paragraphs: string[] }> = {
  wisdom: {
    title: "Wisdom in the Fortune Cookie Tradition",
    paragraphs: [
      "Fortune cookies carrying wisdom messages trace their roots to a blending of Eastern and Western philosophical traditions that accelerated in early twentieth-century California. Chinese immigrants brought proverbial sayings rooted in Confucian ethics, Taoist naturalism, and Buddhist mindfulness, while Japanese-American bakers shaped the cookie itself. Over decades, the pithy maxims inside these cookies became a distinct literary micro-genre — one that condenses the world's wisdom literature into a single sentence anyone can carry in a pocket. From the Analects of Confucius to the Meditations of Marcus Aurelius, the impulse to compress life lessons into memorable phrases has existed for millennia; the fortune cookie simply gave that impulse a new, edible wrapper.",
      "Psychologically, wisdom-oriented fortunes tap into what researchers call the 'need for cognitive closure' — our desire for clear, definitive answers when facing ambiguous situations. A well-crafted wisdom fortune provides a mental anchor, a concise principle the mind can latch onto when circumstances feel chaotic. Studies in aphoristic processing show that brief, balanced sentences are perceived as more truthful than verbose explanations, a phenomenon known as the 'rhyme-as-reason effect.' This means a wisdom fortune does not merely inform; it feels true in a way that longer advice often does not. The element of chance — cracking open a cookie without knowing what is inside — adds a layer of perceived personal relevance, because people naturally search for connections between a random message and their current life circumstances.",
      "To get the most from a wisdom fortune, try treating it as a meditation prompt rather than a simple statement. Read the message once, close your eyes, and sit with it for thirty seconds. Ask yourself: where in my life does this apply right now? Write the fortune on a sticky note and place it where you will see it throughout the day — on a bathroom mirror, a laptop lid, or a car dashboard. By returning to the same phrase repeatedly, you allow its meaning to deepen and shift as your day unfolds. Many mindfulness practitioners use this technique, finding that a single proverb can serve as a thread connecting otherwise scattered moments into a more intentional day.",
    ],
  },
  love: {
    title: "Love Fortunes Across Cultures",
    paragraphs: [
      "Seeking guidance about love from oracles and divination tools is one of humanity's oldest practices. The ancient Greeks consulted the Oracle at Delphi about matters of the heart. Chinese tradition relied on the I Ching to assess romantic compatibility, while in medieval Europe, people turned to love potions, Valentine's Day divination games, and the interpretation of dreams. The fortune cookie inherited this deep human impulse and made it casual and accessible — no appointment with a seer required, just a crack of a cookie. Love fortunes in the fortune cookie tradition blend the romantic idealism of Western love poetry with the pragmatic relational wisdom of Eastern philosophy, creating messages that speak to both the thrill of new attraction and the quiet endurance of lasting partnership.",
      "Love fortunes resonate on a psychological level because romantic uncertainty is among the most intense forms of ambiguity people experience. Neuroscience research shows that uncertainty in romantic contexts activates the same brain regions involved in reward anticipation — the ventral tegmental area and the nucleus accumbens — which means the act of reading a love fortune can itself produce a small dopamine surge. This is amplified by the 'Barnum effect,' the tendency to accept vague, general personality descriptions as uniquely applicable to oneself. A fortune that says 'An unexpected connection will change your perspective' feels tailor-made because the reader's mind immediately populates it with their own hopes, fears, and recent interactions.",
      "To make a love fortune meaningful in daily life, use it as a conversation starter rather than a private prediction. Share it with a partner, a friend, or a family member and discuss what it brings to mind. Couples therapists often use prompt-based exercises to encourage open communication; a love fortune can serve exactly this purpose. If you are single, let the fortune remind you to stay open to connection in ordinary moments — the line at a coffee shop, a comment thread, a neighborhood walk. Love fortunes work best not as prophecy but as permission: permission to hope, to reach out, to believe that the next chapter of your story might surprise you in the best possible way.",
    ],
  },
  career: {
    title: "Career Guidance in the Fortune Cookie Tradition",
    paragraphs: [
      "The tradition of seeking professional guidance through concise, memorable maxims reaches back centuries before the fortune cookie existed. Benjamin Franklin's Poor Richard's Almanack dispensed career wisdom through aphorisms like 'Early to bed and early to rise makes a man healthy, wealthy, and wise.' In East Asia, Confucian teachings emphasized self-cultivation through diligent work and continuous learning, principles that permeated every level of society. The fortune cookie merged these traditions into a uniquely American form, offering bite-sized career encouragement to workers navigating the pressures of industrial and post-industrial economies. Today, career fortune cookies carry forward this legacy, providing miniature pep talks that acknowledge both the ambition and the anxiety woven into professional life.",
      "Career fortunes tap into a psychological phenomenon known as 'self-efficacy,' a concept developed by psychologist Albert Bandura. Self-efficacy is the belief in your own ability to accomplish a task, and research consistently shows it is one of the strongest predictors of actual performance. A career fortune that says 'Your persistence will soon be rewarded' does not magically change external circumstances, but it can reinforce the internal belief that effort matters — and that belief itself changes behavior. People with higher self-efficacy set more ambitious goals, recover faster from setbacks, and persist longer on difficult tasks. A well-timed fortune, read before a presentation or during a frustrating project, can function as what psychologists call a 'micro-intervention,' a small input that produces a disproportionately positive effect on mindset and motivation.",
      "To apply a career fortune practically, try pairing it with a specific action. If your fortune encourages risk-taking, identify one professional risk you have been avoiding — sending a pitch, requesting a raise, volunteering for a challenging project — and commit to acting on it within 48 hours. Write the fortune at the top of your to-do list as a daily theme. Share it with a colleague and discuss how it applies to your team's current challenges. Career fortunes are most powerful when they move from passive reading to active doing. Treat each one not as a vague promise of future success but as a prompt to take one concrete step today toward the professional life you want.",
    ],
  },
  humor: {
    title: "The Role of Humor in Fortune Cookies",
    paragraphs: [
      "Comedy and divination have been intertwined for far longer than most people realize. The court jesters of medieval Europe served as truth-tellers who could say what no advisor dared, wrapping uncomfortable insights in laughter. Zen Buddhist teachers used absurd riddles — koans — to jolt students out of habitual thinking, and Aesop's fables delivered moral lessons through humorous animal tales that have survived for over two thousand years. Fortune cookies sit squarely in this tradition. While the stereotype of a fortune cookie is a solemn proverb, humor has always been part of the experience. The earliest Japanese senbei fortune crackers sometimes contained playful or teasing messages, and American fortune cookie manufacturers learned early that a funny fortune gets shared, remembered, and talked about far more than a serious one.",
      "The psychology behind humor fortunes is rooted in what researchers call 'incongruity theory' — the idea that laughter arises when expectations are violated in a harmless way. When you crack open a cookie expecting a grave pronouncement about your destiny and instead read something that makes you snort with laughter, the surprise itself is the reward. This incongruity produces a small but measurable reduction in cortisol, the stress hormone, and a release of endorphins. A humor fortune also benefits from the 'sharing impulse': funny content is the most shared category across social media platforms, which means a single witty fortune can travel farther and reach more people than the most eloquent piece of wisdom. Fortune cookie humor is inherently democratic — it does not require education, context, or cultural knowledge to land.",
      "To enjoy humor fortunes to their fullest, lean into the social dimension. Read your fortune aloud at the table — the shared laughter of a group amplifies the comedic effect through what psychologists call 'social facilitation.' Save your favorite funny fortunes in your phone's notes app and revisit them on days when you need a lift. Use them as icebreakers in meetings, as captions for social media posts, or as the closing line in a birthday card. If you are feeling creative, try writing your own humor fortunes and slipping them into your friend's lunch bag. The best humor fortunes remind us that not every message needs to be profound to be valuable — sometimes the most fortunate thing that can happen to you is a good laugh.",
    ],
  },
  motivation: {
    title: "Motivational Fortunes and the Psychology of Encouragement",
    paragraphs: [
      "The tradition of using brief, powerful statements to inspire action stretches from the battle cries of ancient generals to the motivational posters that line office corridors today. The Stoic philosophers of Greece and Rome — Seneca, Epictetus, Marcus Aurelius — practiced what they called 'spiritual exercises,' short maxims repeated daily to build psychological resilience. In the modern era, positive psychology researchers like Martin Seligman and Carol Dweck have demonstrated that mindset interventions — even very brief ones — can measurably improve performance, persistence, and well-being. Motivational fortune cookies are a descendant of both these traditions: ancient philosophical practice and contemporary behavioral science, delivered in the unexpected, playful format of a cracked cookie. They carry the weight of centuries of human effort to bottle encouragement into words.",
      "What makes motivational fortunes effective is their intersection of brevity and timing. Research on 'implementation intentions' shows that short, specific prompts — 'When I feel like quitting, I will remember why I started' — are significantly more effective at changing behavior than long-form motivational speeches. A fortune cookie delivers exactly this kind of prompt, and the element of randomness adds perceived personal relevance. The psychological concept of 'self-affirmation theory' suggests that when people encounter messages that align with their core values, their defensive barriers drop and they become more open to change. A motivational fortune that arrives at a moment of self-doubt can bypass the inner critic and speak directly to the part of a person that still believes in their own potential.",
      "To turn a motivational fortune into real-world momentum, use the 'two-minute rule': within two minutes of reading the fortune, identify one small action you can take that aligns with its message. If the fortune says 'Great things start with a single step,' stand up and take that step — send the email, make the call, open the document. Tape the fortune to the edge of your computer monitor where it can serve as a persistent, gentle nudge throughout your workday. Share it with someone who you know is struggling; the act of passing along encouragement reinforces it in your own mind. Motivational fortunes work best when they bridge the gap between inspiration and action — let yours be the push that turns today's intention into tomorrow's progress.",
    ],
  },
  philosophy: {
    title: "Philosophical Inquiry Through Fortune Cookies",
    paragraphs: [
      "The practice of distilling complex philosophical ideas into brief, provocative statements is as old as philosophy itself. Heraclitus wrote in fragments so dense that scholars still debate their meaning twenty-five centuries later. The Tao Te Ching opens with the paradox 'The Tao that can be told is not the eternal Tao,' a single line that has generated millions of pages of commentary. Zen koans — 'What is the sound of one hand clapping?' — use radical brevity to short-circuit rational thought and point toward direct experience. Philosophy fortune cookies inherit this tradition of compressed inquiry. They do not provide answers; they pose questions, present paradoxes, or offer observations that resist easy categorization. In doing so, they transform the casual act of cracking a cookie into a miniature philosophical encounter, inviting the reader to pause and think rather than simply consume.",
      "Philosophically oriented fortunes engage what psychologists call 'need for cognition' — the tendency to seek out, engage in, and enjoy effortful thinking. People high in need for cognition are drawn to puzzles, paradoxes, and ideas that challenge their existing frameworks. A philosophy fortune that reads 'You are both the sculptor and the clay' triggers a cascade of reflection: about agency, identity, the relationship between effort and fate. Research in cognitive psychology shows that this kind of reflective processing — called 'elaborative encoding' — creates stronger, more durable memories than passive reading. This is why philosophy fortunes tend to stick with people long after the cookie crumbs are swept away. They become mental companions, ideas that resurface in quiet moments and gradually reshape how the reader understands their own experience.",
      "To engage deeply with a philosophy fortune, resist the urge to immediately interpret it. Instead, carry the question or paradox with you for an entire day and notice when it feels relevant. Write it in a journal alongside your own reflections — not what the fortune 'means,' but what it makes you think about. Discuss it with a friend over coffee; philosophical conversation is one of the oldest and most rewarding forms of human connection. If you find yourself drawn to a particular fortune, research the philosophical tradition it echoes — you may discover an entire school of thought that resonates with your worldview. Philosophy fortunes are invitations, not conclusions. The value lies not in the answer but in the quality of attention you bring to the question.",
    ],
  },
  adventure: {
    title: "Adventure Fortunes and the Call to Explore",
    paragraphs: [
      "The human urge to explore the unknown is encoded in our deepest myths and oldest stories. Joseph Campbell's concept of the 'hero's journey' — the narrative pattern in which an ordinary person leaves the familiar world, faces challenges, and returns transformed — appears in cultures from ancient Sumeria to modern Hollywood. The Polynesian wayfinders navigated thousands of miles of open ocean using only stars, waves, and bird flights. The Silk Road merchants risked everything for the promise of discovery and trade. Adventure fortune cookies tap into this primal narrative. They speak to the part of you that knows comfort is not the same as fulfillment, that routine, while safe, can become a cage. These fortunes carry the echo of every departure, every first step into territory unmarked on any map, every decision to choose the unknown over the predictable.",
      "Psychologically, adventure fortunes leverage what researchers call 'sensation seeking' — the trait-level tendency to pursue novel, varied, and intense experiences. But you do not need to be a skydiver or a globe-trotter to benefit from an adventure fortune. Research on 'psychological richness' — a concept distinct from both happiness and meaning — shows that a life filled with varied, perspective-changing experiences is independently valued by most people. An adventure fortune that encourages you to 'take the path you have never walked' can be fulfilled by trying a new restaurant, learning a few phrases in a foreign language, or striking up a conversation with a stranger. The fortune expands your definition of adventure to include any deliberate step outside your comfort zone, no matter how small.",
      "To act on an adventure fortune, create what behavioral scientists call a 'commitment device.' Write the fortune on a card and place it in your wallet. Each time you see it, ask yourself: what is one thing I could do today that my routine self would not? Keep an 'adventure log' — a simple list of new experiences, however minor, that you try each week. Share your adventure fortune on social media and invite friends to join you in interpreting it. Plan a 'fortune-guided day' where every decision — where to eat, which direction to walk, what to read — is influenced by the spirit of your fortune. Adventure fortunes are at their best when they move from words on paper to choices in the real world, reminding you that the most interesting stories are written by people who said yes when they could have said no.",
    ],
  },
  mystery: {
    title: "The Allure of Mystery in Fortune Telling",
    paragraphs: [
      "Mystery fortune cookies connect to the deepest and oldest layer of the fortune-telling tradition — the encounter with the genuinely unknown. The Oracle at Delphi delivered prophecies so deliberately ambiguous that their true meaning often became clear only after the foretold events had already unfolded. The I Ching, one of the world's oldest divination systems, presents hexagrams whose interpretations shift depending on the reader's situation, mood, and level of self-awareness. Tarot cards work on a similar principle: the images are rich enough to support multiple readings, and the 'correct' interpretation is the one that resonates most deeply with the seeker. Mystery fortune cookies inherit this tradition of productive ambiguity. They do not tell you what will happen; they create a space in which your own intuition, fears, and hopes can surface and speak.",
      "The psychological power of mystery fortunes lies in a phenomenon called 'apophenia' — the human tendency to perceive meaningful patterns in random or ambiguous information. This is not a flaw in human cognition; it is a feature. Our pattern-seeking minds evolved to find connections, and when presented with an enigmatic message, the brain automatically begins searching for relevance. A mystery fortune that reads 'What you seek is also seeking you' activates a cascade of personal associations: the job you have been wanting, the relationship you have been hoping for, the creative project you have been postponing. The fortune becomes a mirror, reflecting back whatever is most alive in the reader's inner world. This is why mystery fortunes are the most photographed and shared category — their ambiguity makes them universally personal.",
      "To engage with a mystery fortune, embrace the uncertainty rather than rushing to resolve it. Place the fortune somewhere visible and revisit it over several days, noticing how your interpretation shifts as your circumstances change. Write down your first reaction, then check back a week later to see whether the fortune has taken on a different shade of meaning. Share it with someone you trust and compare interpretations — you may be surprised by how differently two people read the same cryptic message. Mystery fortunes reward patience and attention. They are not puzzles to be solved but invitations to sit with the unknown, to become comfortable with ambiguity, and to trust that meaning often arrives on its own schedule rather than ours.",
    ],
  },
};

const CATEGORY_RELATED_POSTS: Record<FortuneCategory, { slug: string; title: string }[]> = {
  wisdom: [
    { slug: "history-of-fortune-cookies", title: "The Surprising History of Fortune Cookies" },
    { slug: "psychology-of-fortune-telling", title: "The Psychology Behind Fortune Telling" },
    { slug: "how-to-create-daily-gratitude-practice-fortune-cookies", title: "Daily Gratitude Practice With Fortune Cookies" },
  ],
  love: [
    { slug: "fortune-cookies-that-changed-lives", title: "Fortune Cookies That Changed Lives" },
    { slug: "zodiac-fortune-cookies-astrology-meets-wisdom", title: "Zodiac Fortune Cookies: Astrology Meets Wisdom" },
    { slug: "psychology-of-fortune-telling", title: "The Psychology Behind Fortune Telling" },
  ],
  career: [
    { slug: "famous-fortunes-that-came-true", title: "Famous Fortune Predictions That Came True" },
    { slug: "fortune-cookies-that-changed-lives", title: "Fortune Cookies That Changed Lives" },
    { slug: "psychology-of-fortune-telling", title: "The Psychology Behind Fortune Telling" },
  ],
  humor: [
    { slug: "history-of-fortune-cookies", title: "The Surprising History of Fortune Cookies" },
    { slug: "fortune-cookie-traditions", title: "Fortune Cookie Traditions Around the World" },
    { slug: "why-we-need-small-joys", title: "The Science of Small Joys" },
  ],
  motivation: [
    { slug: "how-to-create-daily-gratitude-practice-fortune-cookies", title: "Daily Gratitude Practice With Fortune Cookies" },
    { slug: "why-we-need-small-joys", title: "The Science of Small Joys" },
    { slug: "famous-fortunes-that-came-true", title: "Famous Fortune Predictions That Came True" },
  ],
  philosophy: [
    { slug: "psychology-of-fortune-telling", title: "The Psychology Behind Fortune Telling" },
    { slug: "history-of-fortune-cookies", title: "The Surprising History of Fortune Cookies" },
    { slug: "beginners-guide-tarot-card-reading-symbols-meanings", title: "A Beginner's Guide to Tarot Card Reading" },
  ],
  adventure: [
    { slug: "good-luck-charms-from-around-the-world", title: "Good Luck Charms From Around the World" },
    { slug: "fortune-cookie-traditions", title: "Fortune Cookie Traditions Around the World" },
    { slug: "famous-fortunes-that-came-true", title: "Famous Fortune Predictions That Came True" },
  ],
  mystery: [
    { slug: "beginners-guide-tarot-card-reading-symbols-meanings", title: "A Beginner's Guide to Tarot Card Reading" },
    { slug: "lucky-numbers-superstitions-science", title: "Lucky Numbers, Superstitions, and Science" },
    { slug: "psychology-of-fortune-telling", title: "The Psychology Behind Fortune Telling" },
  ],
};

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = category as FortuneCategory;
  const title = `${cat.charAt(0).toUpperCase() + cat.slice(1)} Fortune Cookies`;
  const description = categoryDescriptions[cat] || `Discover ${category} fortune cookie messages.`;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${SITE_URL}/fortune/${category}`,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/fortune/${category}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = category as FortuneCategory;
  const fortunes = getFortunesByCategory(cat);
  if (fortunes.length === 0) {
    return <div className="bg-warm-gradient min-h-screen px-4 py-16 text-center text-foreground/50">Category not found.</div>;
  }

  const rarityColor = getRarityColor(fortunes[0].rarity);
  const rarityLabel = getRarityLabel(fortunes[0].rarity);
  const description = categoryDescriptions[cat];
  const faqs = categoryFAQs[cat] || [];

  // Daily featured fortune for this category
  const seed = dateSeed();
  const rng = seededRandom(seed * 100 + CATEGORIES.indexOf(cat));
  const featuredIndex = Math.floor(rng() * fortunes.length);
  const featured = fortunes[featuredIndex];

  // 12 sample fortunes (seeded by date)
  const sampleRng = seededRandom(seed * 200 + CATEGORIES.indexOf(cat));
  const shuffled = [...fortunes].sort(() => sampleRng() - 0.5);
  const samples = shuffled.slice(0, 12);

  const catTitle = cat.charAt(0).toUpperCase() + cat.slice(1);
  const culturalContext = CATEGORY_CULTURAL_CONTEXT[cat];
  const relatedPosts = CATEGORY_RELATED_POSTS[cat] || [];

  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Fortunes", url: `${SITE_URL}/fortune/wisdom` },
          { name: catTitle, url: `${SITE_URL}/fortune/${category}` },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />

      <article className="mx-auto max-w-2xl">
        <h1 className="text-golden-shimmer mb-2 text-3xl sm:text-4xl font-bold text-center">
          {catTitle} Fortune Cookies
        </h1>
        <p className="text-center text-foreground/50 mb-8">{description}</p>

        <div className="flex items-center justify-center gap-3 mb-10">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: rarityColor }}
          >
            {rarityLabel}
          </span>
          <span className="text-sm text-foreground/40">
            {fortunes.length} fortunes
          </span>
        </div>

        {/* Featured Fortune */}
        <div
          className="relative overflow-hidden rounded-2xl border p-5 sm:p-8 text-center mb-12"
          style={{
            borderColor: rarityColor + "30",
            background: `radial-gradient(ellipse at center, ${rarityColor}08 0%, transparent 70%)`,
          }}
        >
          <div className="absolute left-3 top-3 text-gold/30">✦</div>
          <div className="absolute right-3 top-3 text-gold/30">✦</div>
          <div className="absolute bottom-3 left-3 text-gold/30">✦</div>
          <div className="absolute bottom-3 right-3 text-gold/30">✦</div>
          <p className="text-xs uppercase tracking-wider text-foreground/30 mb-4">
            Today&apos;s {catTitle} Fortune
          </p>
          <p className="font-serif text-xl leading-relaxed text-cream">
            &ldquo;{featured.text}&rdquo;
          </p>
        </div>

        {/* Category Description */}
        <div className="rounded-2xl border border-border bg-background p-6 mb-12">
          <h2 className="text-lg font-semibold text-gold mb-3">About {catTitle} Fortunes</h2>
          <p className="text-sm text-muted leading-relaxed">
            {CATEGORY_DESCRIPTIONS[cat]}
          </p>
        </div>

        {/* Cultural Context */}
        {culturalContext && (
          <section className="rounded-2xl border border-border bg-background p-6 mb-8">
            <h2 className="text-lg font-semibold text-gold mb-3">{culturalContext.title}</h2>
            {culturalContext.paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed text-muted mb-3 last:mb-0">{p}</p>
            ))}
          </section>
        )}

        {/* Related Reading */}
        {relatedPosts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gold mb-3">Related Reading</h2>
            <div className="flex flex-wrap gap-2">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="text-xs text-gold/60 hover:text-gold transition border border-border rounded-full px-3 py-1"
                >
                  {post.title} →
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Sample Fortunes */}
        <h2 className="text-xl font-semibold text-gold mb-6">
          Sample {catTitle} Fortunes
        </h2>
        <div className="grid gap-3 mb-12">
          {samples.map((f, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground/70"
            >
              &ldquo;{f.text}&rdquo;
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block rounded-full bg-gold px-8 py-3 font-semibold text-background transition hover:bg-gold-light"
          >
            Break a Cookie for Your {catTitle} Fortune
          </Link>
        </div>

        {/* Browse other categories */}
        <div className="mt-16 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-gold mb-4 text-center">
            Explore Other Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.filter((c) => c !== cat).map((c) => (
              <Link
                key={c}
                href={`/fortune/${c}`}
                className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground/50 transition hover:border-gold/40 hover:text-gold capitalize"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
