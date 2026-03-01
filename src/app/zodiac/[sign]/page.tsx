import type { Metadata } from "next";
import Link from "next/link";
import {
  seededRandom,
  dateSeed,
  getFortunesByCategory,
  getRarityColor,
  getRarityLabel,
  FortuneCategory,
} from "@/lib/fortuneEngine";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import { ZODIAC_SIGNS } from "@/lib/horoscopes";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const revalidate = 43200; // 12 hours — refresh at least twice daily

const elementCategory: Record<string, FortuneCategory> = {
  Fire: "motivation",
  Earth: "career",
  Air: "philosophy",
  Water: "love",
};

const elementColors: Record<string, string> = {
  Fire: "#e74c3c",
  Earth: "#27ae60",
  Air: "#9b59b6",
  Water: "#3498db",
};

const SIGN_DESCRIPTIONS: Record<string, { personality: string; strengths: string; challenges: string; bestMatches: string }> = {
  aries: {
    personality: "Aries is the first sign of the zodiac, embodying the raw energy of new beginnings and bold initiative. Ruled by Mars, the planet of action and desire, Aries natives are natural-born leaders who thrive on competition and challenge. They possess an infectious enthusiasm that inspires those around them, often charging headfirst into situations where others hesitate. Their cardinal fire energy makes them pioneers who would rather forge a new path than follow an existing one.",
    strengths: "Courageous, determined, confident, enthusiastic, honest",
    challenges: "Impatient, short-tempered, impulsive, competitive to a fault",
    bestMatches: "Leo, Sagittarius, Gemini",
  },
  taurus: {
    personality: "Taurus is the zodiac's steadfast earth sign, ruled by Venus, the planet of love, beauty, and material comfort. Taureans are known for their unwavering determination and deep appreciation for life's sensory pleasures — fine food, art, music, and nature. They build their lives on stability and routine, preferring slow and steady progress over risky shortcuts. Once a Taurus commits to a goal or a relationship, their loyalty and persistence are virtually unshakeable.",
    strengths: "Reliable, patient, practical, devoted, responsible",
    challenges: "Stubborn, possessive, resistant to change, overly materialistic",
    bestMatches: "Virgo, Capricorn, Cancer",
  },
  gemini: {
    personality: "Gemini is the mutable air sign ruled by Mercury, the planet of communication and intellect. Geminis are endlessly curious, quick-witted, and socially versatile, able to adapt to any conversation or environment with remarkable ease. Often called the storytellers of the zodiac, they have a gift for language and a hunger for information that keeps them constantly learning. Their dual nature allows them to see multiple perspectives simultaneously, making them excellent mediators and creative thinkers.",
    strengths: "Adaptable, outgoing, intelligent, eloquent, versatile",
    challenges: "Indecisive, inconsistent, restless, prone to superficiality",
    bestMatches: "Libra, Aquarius, Aries",
  },
  cancer: {
    personality: "Cancer is the cardinal water sign ruled by the Moon, making its natives deeply intuitive, emotionally intelligent, and profoundly connected to home and family. Cancers possess an almost psychic ability to sense the moods and needs of those around them, often providing comfort before it is even requested. Beneath their protective shell lies a rich inner world of imagination and sentiment. They are the nurturers of the zodiac, creating safe spaces wherever they go and fiercely protecting those they love.",
    strengths: "Nurturing, intuitive, loyal, empathetic, tenacious",
    challenges: "Moody, overly sensitive, clingy, prone to holding grudges",
    bestMatches: "Scorpio, Pisces, Taurus",
  },
  leo: {
    personality: "Leo is the fixed fire sign ruled by the Sun, radiating warmth, charisma, and a magnetic presence that naturally draws others in. Leos are born performers with a generous heart and a strong desire to be recognized and appreciated for their contributions. Their creativity is boundless, and they approach life with a dramatic flair that turns everyday moments into memorable experiences. At their best, Leos are inspiring leaders who uplift everyone around them with genuine warmth and unwavering confidence.",
    strengths: "Creative, passionate, generous, warm-hearted, cheerful",
    challenges: "Arrogant, attention-seeking, inflexible, domineering",
    bestMatches: "Aries, Sagittarius, Libra",
  },
  virgo: {
    personality: "Virgo is the mutable earth sign ruled by Mercury, combining analytical intelligence with a deep desire to be of service. Virgos are the meticulous perfectionists of the zodiac, with an extraordinary eye for detail that allows them to spot flaws and inefficiencies others miss entirely. They express love through practical acts of care — organizing, problem-solving, and quietly ensuring everything runs smoothly. Behind their reserved exterior lies a sharp mind and a genuinely kind heart devoted to self-improvement and helping others thrive.",
    strengths: "Analytical, hardworking, practical, detail-oriented, kind",
    challenges: "Overly critical, perfectionist, worrisome, reserved",
    bestMatches: "Taurus, Capricorn, Cancer",
  },
  libra: {
    personality: "Libra is the cardinal air sign ruled by Venus, making its natives natural diplomats with a refined aesthetic sensibility and a deep longing for harmony in all things. Libras excel at seeing every side of an issue, which makes them fair-minded mediators but can also lead to prolonged indecision. They are drawn to beauty, partnership, and intellectual exchange, thriving in environments where collaboration and mutual respect are valued. Their social grace and charm make them some of the most beloved people in any group.",
    strengths: "Diplomatic, fair-minded, social, gracious, cooperative",
    challenges: "Indecisive, conflict-avoidant, people-pleasing, self-pitying",
    bestMatches: "Gemini, Aquarius, Leo",
  },
  scorpio: {
    personality: "Scorpio is the fixed water sign traditionally ruled by Mars and modernly by Pluto, giving its natives an intensity and emotional depth that few other signs can match. Scorpios are fiercely private, deeply perceptive, and driven by a relentless desire to uncover hidden truths beneath the surface. They experience life with extraordinary passion — when they love, they love completely, and when they commit to a purpose, they pursue it with laser-focused determination. Their transformative nature means they are constantly evolving, rising from challenges stronger than before.",
    strengths: "Resourceful, passionate, brave, strategic, loyal",
    challenges: "Jealous, secretive, controlling, prone to obsession",
    bestMatches: "Cancer, Pisces, Virgo",
  },
  sagittarius: {
    personality: "Sagittarius is the mutable fire sign ruled by Jupiter, the planet of expansion, abundance, and higher learning. Sagittarians are the adventurers and philosophers of the zodiac, driven by an insatiable curiosity about the world and a need for freedom and exploration. They are naturally optimistic, often seeing possibility where others see limitation, and their infectious enthusiasm makes them magnetic companions. Their love of truth and wisdom extends beyond physical travel into the realms of education, spirituality, and cross-cultural understanding.",
    strengths: "Optimistic, adventurous, honest, philosophical, generous",
    challenges: "Tactless, restless, overconfident, commitment-averse",
    bestMatches: "Aries, Leo, Aquarius",
  },
  capricorn: {
    personality: "Capricorn is the cardinal earth sign ruled by Saturn, the planet of discipline, structure, and long-term achievement. Capricorns are the master builders of the zodiac, approaching life with a strategic mindset and an unwavering work ethic that steadily carries them toward their ambitious goals. They value tradition, responsibility, and earned respect, often maturing into positions of authority and influence through sheer persistence. Beneath their serious exterior lies a dry wit and a deeply caring nature that reveals itself to those who earn their trust over time.",
    strengths: "Disciplined, responsible, ambitious, patient, resourceful",
    challenges: "Pessimistic, rigid, workaholic, emotionally guarded",
    bestMatches: "Taurus, Virgo, Pisces",
  },
  aquarius: {
    personality: "Aquarius is the fixed air sign traditionally ruled by Saturn and modernly by Uranus, the planet of innovation, rebellion, and sudden insight. Aquarians are the visionaries and humanitarians of the zodiac, driven by ideals of progress, equality, and collective well-being. They think in unconventional ways, often arriving at brilliant solutions that others would never consider, and they value intellectual freedom above almost everything else. Their detached perspective allows them to champion social causes with clarity, though it can sometimes make personal emotional connections feel more challenging.",
    strengths: "Progressive, original, independent, humanitarian, intellectual",
    challenges: "Emotionally detached, stubborn, contrarian, aloof",
    bestMatches: "Gemini, Libra, Sagittarius",
  },
  pisces: {
    personality: "Pisces is the mutable water sign ruled by Jupiter traditionally and Neptune in modern astrology, giving its natives a boundless imagination and a deeply compassionate, empathic nature. Pisceans are the dreamers and mystics of the zodiac, possessing an intuitive understanding of human emotion that borders on the psychic. They experience the world through feeling, often absorbing the energies and moods of those around them like an emotional sponge. Their creative gifts — in art, music, writing, or healing — flow from this profound connection to the unseen currents of life.",
    strengths: "Compassionate, artistic, intuitive, gentle, wise",
    challenges: "Escapist, overly trusting, fearful of confrontation, prone to martyrdom",
    bestMatches: "Cancer, Scorpio, Capricorn",
  },
};

const SIGN_PROFILES: Record<string, {
  personality: string[];
  fortuneWisdom: { fortune: string; commentary: string }[];
}> = {
  aries: {
    personality: [
      "Aries, the Ram, charges into life headfirst. As the first sign of the zodiac and a cardinal fire sign ruled by Mars, Aries embodies the raw energy of new beginnings and bold initiative. Those born between March 21 and April 19 carry within them a spark that refuses to be extinguished. They are the trailblazers, the ones who step forward when everyone else steps back. Mars, the ancient god of war, lends Aries its courage, competitive drive, and an almost primal need to assert itself in the world. Where other signs deliberate, Aries acts. Where others see obstacles, Aries sees challenges to be conquered. This instinctive bravery is not recklessness for its own sake but rather a deep trust in their own ability to handle whatever comes next. Aries people are genuinely honest, often disarmingly so, because they simply do not have the patience for deception or hidden agendas.",
      "In relationships, Aries loves the thrill of the chase and brings an intense, all-consuming passion to their romantic connections. They fall hard and fast, showering their partner with attention, grand gestures, and unwavering devotion in the early stages. An Aries in love is fiercely protective and generous, always willing to fight for the people they care about. However, they need a partner who can match their energy and independence. Clinginess or passivity can quickly dampen the Aries flame. Their ideal relationships are built on mutual respect, shared adventures, and enough space for both partners to maintain their individuality. Fire signs Leo and Sagittarius naturally complement Aries with matching enthusiasm, while air sign Gemini provides the intellectual stimulation that keeps Aries engaged long-term.",
      "At work, Aries gravitates toward leadership roles where they can set the pace and make decisive calls. They excel in high-pressure environments that would overwhelm more cautious signs, thriving on deadlines, competition, and the adrenaline of launching something new. Entrepreneurship suits them particularly well because they possess both the vision to see opportunities and the fearlessness to pursue them before the market catches up. However, Aries can struggle with the long, unglamorous middle stages of projects, preferring to spark new ideas rather than meticulously maintain existing ones. The most successful Aries learn to surround themselves with detail-oriented teammates who can carry their bold visions through to completion.",
      "The deeper lesson for Aries lies in learning that true strength is not only about charging forward but also about knowing when to pause, listen, and let others lead. Their impatience and short temper are the shadow side of their remarkable drive, and mastering these tendencies transforms a good Aries into a great one. When they channel their Mars energy with intention rather than impulse, they become unstoppable forces for positive change. The Ram's journey through life is ultimately about discovering that the greatest battles are not fought against external enemies but within oneself, and that patience and persistence are forms of courage every bit as valid as the dramatic heroism they so naturally embody.",
    ],
    fortuneWisdom: [
      { fortune: "The path to greatness begins with a single bold step", commentary: "This fortune captures the Aries spirit perfectly. As the sign that never waits for permission to begin, Aries understands intuitively that action precedes motivation. While others plan endlessly, the Ram has already taken that first step and learned more from the experience than any amount of preparation could provide." },
      { fortune: "Your courage will be rewarded when you least expect it", commentary: "Mars-ruled Aries often acts before thinking, and this fortune reminds them that their instinct for action is a gift, not a flaw. The rewards that come to Aries are rarely the ones they chased deliberately but rather the unexpected blessings that flow from their willingness to take risks others avoid." },
      { fortune: "A leader who listens becomes truly invincible", commentary: "This is the fortune Aries needs most. Their natural command presence is undeniable, but the difference between a good leader and a legendary one lies in the ability to hear what others are saying. When Aries combines their decisive nature with genuine receptivity, they become the kind of leader people follow out of love rather than obligation." },
    ],
  },
  taurus: {
    personality: [
      "Taurus, the Bull, stands firm where others waver. As a fixed earth sign ruled by Venus, those born between April 20 and May 20 possess a grounding energy that anchors everyone and everything around them. Venus bestows upon Taurus a deep and genuine appreciation for beauty, comfort, and the sensory pleasures that make life worth living. A Taurus does not merely eat a meal but savors every bite. They do not simply listen to music but let it wash through them completely. This sensory richness is not hedonism but rather a profound understanding that the physical world is sacred, that the textures, tastes, and fragrances of daily life deserve reverence. Their fixed earth nature gives them a steadiness that others instinctively rely upon, making Taurus one of the most trustworthy and dependable signs in the entire zodiac.",
      "In relationships, Taurus is the definition of devoted. When a Taurus chooses you, they choose you completely, with a loyalty that weathers storms, seasons, and decades. They express love through tangible acts of care: cooking a favorite meal, creating a beautiful home, remembering small details that others forget, and showing up consistently when it matters most. Their approach to romance is patient and deliberate, preferring to build something lasting over chasing fleeting sparks. Physical affection is deeply important to Taurus, and they communicate love through touch, proximity, and shared sensory experiences. Their best matches include fellow earth signs Virgo and Capricorn, who share their practical approach to commitment, and water sign Cancer, whose nurturing nature creates the emotional safety Taurus craves.",
      "Professionally, Taurus brings an unmatched work ethic and a talent for building things of lasting value. They are not the flashiest performers in the office, but they are the ones who show up every day, do excellent work consistently, and steadily advance through sheer reliability. Taurus thrives in fields related to finance, real estate, food, art, music, and anything that involves creating tangible results from sustained effort. They have an innate understanding of material value and can spot a sound investment, whether financial or personal, with remarkable accuracy. Their patience allows them to play the long game when others have already given up, and their stubborn persistence ensures that what they build stands the test of time.",
      "The growth edge for Taurus lies in embracing change rather than resisting it with every fiber of their being. Their stubbornness, while a tremendous asset when channeled toward worthy goals, can become a prison when it prevents them from adapting to new circumstances. The Bull's journey is about learning that flexibility is not weakness and that letting go of what no longer serves them creates space for something even better. When Taurus combines their extraordinary patience and determination with a willingness to evolve, they discover that the security they seek was never in the external world at all but within their own unshakeable inner foundation. The most evolved Taurus natives understand that true abundance is not about accumulation but about appreciating what is already present.",
    ],
    fortuneWisdom: [
      { fortune: "Patience is not passive waiting but active trust in the process", commentary: "No sign understands patience like Taurus. While the world rushes and frets, the Bull knows that the best things in life — love, wealth, mastery — are cultivated slowly. This fortune validates the Taurus approach to life: steady, deliberate, and rooted in the confidence that their persistence will be rewarded." },
      { fortune: "The richest treasures are found in the simplest moments", commentary: "Venus-ruled Taurus already knows this truth in their bones. A perfect cup of coffee, sunlight through a window, the warmth of a loved one nearby — these are the moments Taurus lives for. This fortune reminds them that their capacity to find joy in simplicity is not naivety but wisdom that others spend a lifetime trying to learn." },
      { fortune: "Let go of one thing today and watch two blessings arrive", commentary: "This is the fortune that challenges Taurus most directly. Their instinct is to hold on tightly to what they have, but growth requires release. When Taurus can loosen their grip just slightly, they often discover that the universe fills the space with something even more beautiful than what they surrendered." },
    ],
  },
  gemini: {
    personality: [
      "Gemini, the Twins, dances through life with a quicksilver mind and an insatiable hunger for experience. As a mutable air sign ruled by Mercury, those born between May 21 and June 20 are gifted with extraordinary mental agility, social versatility, and a curiosity that never rests. Mercury, the messenger of the gods, gives Gemini an unparalleled facility with words, ideas, and connections. A Gemini can walk into any room and find something fascinating to discuss with anyone present, shifting seamlessly between topics, tones, and social registers with a naturalness that others can only envy. Their dual nature, symbolized by the Twins, is often misunderstood as two-facedness, but it is more accurately described as a multifaceted perspective that allows them to hold contradictions comfortably and see truths that more single-minded signs miss entirely.",
      "In relationships, Gemini needs intellectual stimulation above all else. A partner who can match their wit, engage in spirited debate, and introduce them to new ideas will hold a Gemini's attention far longer than one who offers only physical attraction or emotional intensity. They communicate love through conversation, humor, shared discoveries, and a playful energy that keeps the relationship feeling fresh and alive. Gemini can struggle with commitment when they fear it means monotony, but when they find a partner who understands that depth and variety are not mutually exclusive, they become surprisingly devoted. Air signs Libra and Aquarius speak Gemini's intellectual language naturally, while fire sign Aries provides the dynamic energy and spontaneity that keeps Gemini endlessly engaged.",
      "At work, Gemini excels in roles that demand communication, adaptability, and rapid information processing. Journalism, marketing, teaching, writing, sales, technology, and any field that involves connecting ideas or people to one another plays to their natural strengths. They are the colleagues who can explain complex concepts in simple terms, who generate ten ideas in the time it takes others to develop one, and who keep team morale high with their infectious humor and optimism. Their challenge in professional settings is follow-through: Gemini often starts more projects than they finish, their attention pulled toward the newest and most stimulating option. The most successful Geminis learn to harness their versatility as a strategic advantage rather than letting it scatter their considerable talents across too many directions.",
      "The deeper journey for Gemini involves learning that beneath the constant motion of their mind lies a still, centered self that does not need external stimulation to feel alive. Their restlessness and occasional superficiality are symptoms of avoiding the depths within themselves, and the most transformative growth comes when Gemini turns their legendary curiosity inward. When they discover that their own inner world is as vast and fascinating as the external one they explore so eagerly, they unlock a level of wisdom and presence that makes their already formidable communication gifts truly extraordinary. The evolved Gemini does not merely collect information but synthesizes it into genuine understanding, becoming the bridge between knowledge and wisdom that their Mercury rulership always intended them to be.",
    ],
    fortuneWisdom: [
      { fortune: "Every conversation holds a hidden lesson for those who truly listen", commentary: "Mercury-ruled Gemini is the zodiac's great communicator, but this fortune gently redirects their gift from speaking to listening. Gemini's natural verbal brilliance shines brightest when it is informed by deep listening, and the hidden lessons they discover in ordinary conversations often become the seeds of their most brilliant ideas." },
      { fortune: "Two paths diverge, and the wise traveler walks both before choosing", commentary: "This fortune speaks directly to Gemini's dual nature. Where others see indecision, this fortune reframes the Gemini approach as wisdom. Their willingness to explore multiple options before committing is not a weakness but a sophisticated strategy for making well-informed choices that honor the complexity of real life." },
      { fortune: "The mind that wanders freely discovers what the focused mind overlooks", commentary: "Gemini's restless, ranging curiosity is often criticized as scattered, but this fortune celebrates it as a form of creative intelligence. Many of humanity's greatest breakthroughs came from making unexpected connections between unrelated fields — exactly the kind of mental cross-pollination at which Gemini naturally excels." },
    ],
  },
  cancer: {
    personality: [
      "Cancer, the Crab, navigates the world with a hard outer shell and an impossibly tender interior. As a cardinal water sign ruled by the Moon, those born between June 21 and July 22 are deeply attuned to the emotional undercurrents that flow beneath the surface of everyday life. The Moon's influence gives Cancer an almost psychic sensitivity to the feelings, needs, and unspoken concerns of those around them. They can walk into a room and instantly sense who is happy, who is struggling, and who needs a quiet word of comfort. This emotional intelligence is not a learned skill but an innate gift, as natural to Cancer as breathing. Their cardinal nature means they do not merely feel emotions but actively channel them into caring for others, building homes, creating family bonds, and nurturing every living thing that comes within their orbit.",
      "In relationships, Cancer loves with a depth and devotion that can be overwhelming in its intensity. When a Cancer opens their heart to you, they are giving you access to their entire emotional universe, a gift they do not offer lightly or frequently. They remember anniversaries, notice when something is wrong before you say a word, and create an atmosphere of emotional safety that allows their partners to be fully vulnerable. Their love language is caretaking in its most beautiful form: anticipating needs, providing comfort, and building a shared life that feels like coming home. However, Cancer must be careful not to use caretaking as a way to avoid their own needs or to create dependency. Their best romantic matches include fellow water signs Scorpio and Pisces, who understand the depths of emotion Cancer inhabits, and earth sign Taurus, whose steadfast nature provides the security Cancer needs to fully bloom.",
      "Professionally, Cancer brings emotional intelligence, tenacity, and a protective instinct to their work that makes them exceptional in caregiving, hospitality, real estate, counseling, education, food service, and any field that involves nurturing others or creating safe, welcoming environments. They are the bosses who remember every team member's birthday, the colleagues who sense when morale is dropping and quietly work to restore it, and the entrepreneurs who build businesses that feel like families. Cancer's cardinal energy gives them more ambition than they are often credited with, and their determination to provide security for their loved ones drives them to achieve remarkable professional success. Their tenacity, symbolized by the Crab's famous grip, means that once they set a goal, they hold on with quiet ferocity until it is achieved.",
      "The growth path for Cancer involves learning to distinguish between genuine nurturing and emotional self-protection disguised as caring for others. Their tendency to hold grudges, retreat into their shell at the first sign of conflict, and use moodiness as a shield can prevent them from experiencing the deep connections they truly desire. The evolved Cancer learns that vulnerability is not a liability but their greatest strength, and that setting healthy boundaries actually deepens intimacy rather than threatening it. When Cancer combines their extraordinary emotional depth with the courage to remain open even when it hurts, they become the profound healers and soulful leaders the world desperately needs. Their journey is ultimately about learning that the home they are always building is not just a physical space but an inner sanctuary of self-love that no external circumstance can ever take away.",
    ],
    fortuneWisdom: [
      { fortune: "The home you seek already lives within your heart", commentary: "Cancer spends a lifetime building external security — the perfect home, the loving family, the safe routines — but this fortune points toward a deeper truth. The sense of belonging and safety Cancer craves is ultimately an inside job, and when they cultivate that inner home, everything they build in the outer world becomes even more beautiful." },
      { fortune: "Your sensitivity is not a weakness but a superpower in disguise", commentary: "In a world that often rewards emotional detachment, Cancer's deep feeling nature can seem like a liability. This fortune affirms what the Moon-ruled Crab secretly knows: their ability to feel deeply, to empathize completely, and to sense what others cannot is an extraordinary gift that the world needs more of, not less." },
      { fortune: "Letting someone see your tears is the bravest thing you can do", commentary: "Cancer's protective shell exists for good reason, but this fortune challenges them to practice the vulnerability they so beautifully create space for in others. When the Crab allows themselves to be seen in their most tender moments, they discover that the love they receive is deeper and more authentic than anything their shell could ever protect." },
    ],
  },
  leo: {
    personality: [
      "Leo, the Lion, moves through the world with a radiance that is impossible to ignore. As a fixed fire sign ruled by the Sun, those born between July 23 and August 22 carry within them the warmth, vitality, and creative power of our solar system's central star. Just as all planets orbit the Sun, Leo possesses a natural gravitational pull that draws people into their orbit. This is not mere ego, though Leo is often accused of having an outsized one, but rather the authentic expression of a sign whose fundamental purpose is to shine, to create, and to remind others of their own inner light. When a Leo walks into a room, the energy shifts. Conversations become livelier, laughter comes more easily, and the atmosphere itself seems to brighten. This is the Leo gift: the ability to make every space they enter feel more alive.",
      "In relationships, Leo brings a generosity and warmth that can make their partner feel like the most special person in the world. They love grandly, with dramatic gestures, heartfelt declarations, and a loyalty that runs bone-deep. A Leo in love is fiercely protective, endlessly encouraging, and genuinely invested in their partner's happiness and success. They need a partner who can both appreciate their radiance and reflect it back, someone secure enough to celebrate Leo's gifts without feeling diminished by them. Flattery alone will not sustain a Leo relationship; they need sincere admiration rooted in genuine respect. Fellow fire signs Aries and Sagittarius match Leo's passion and energy, while air sign Libra provides the sophisticated appreciation and partnership dynamic that Leo finds irresistible.",
      "Professionally, Leo is drawn to any arena where their creativity, charisma, and leadership abilities can shine. Entertainment, the arts, entrepreneurship, politics, education, luxury brands, and any role that places them center stage or at the helm of a creative vision naturally attracts the Lion. They are inspiring managers who motivate through enthusiasm rather than fear, visionary leaders who paint compelling pictures of what could be, and tireless champions of the people and projects they believe in. Leo's fixed nature gives them remarkable staying power once they commit to a cause, and their Sun-ruled confidence allows them to weather criticism and setbacks that would discourage less resilient signs. Their challenge is learning to share the spotlight and to recognize that collaboration often produces results more magnificent than even the most brilliant solo performance.",
      "The deeper lesson for Leo is discovering that their worth does not depend on external validation, applause, or recognition. Beneath the confident exterior, many Leos harbor a fear that without their achievements and their audience, they might not be enough. The evolved Leo learns that the Sun does not shine because anyone asks it to — it shines because that is its nature. When Leo stops performing for approval and starts creating from a place of genuine self-love and joy, their impact becomes truly extraordinary. The Lion's ultimate journey is from ego-driven expression to heart-centered generosity, from needing to be seen to simply choosing to illuminate the world because they cannot help themselves. This is the Leo at their highest: not a performer seeking applause but a source of warmth that makes everything and everyone around them grow.",
    ],
    fortuneWisdom: [
      { fortune: "The light you share with others never diminishes your own", commentary: "This fortune addresses Leo's deepest fear and greatest truth simultaneously. The Lion sometimes worries that sharing the spotlight means losing their own brilliance, but the opposite is true. Like the Sun itself, Leo's light only grows brighter the more freely and generously they give it away." },
      { fortune: "True royalty is measured not by the crown but by the kindness beneath it", commentary: "Leo is often called the royalty of the zodiac, and this fortune challenges them to embody that title at its highest expression. The greatest kings and queens in history are remembered not for their wealth or power but for their compassion and service — the very qualities that transform Leo from a charismatic performer into a beloved leader." },
      { fortune: "Create something today that makes your soul roar with joy", commentary: "This fortune speaks directly to Leo's creative fire. The Lion is at their absolute best when they are creating — whether art, experiences, businesses, or moments of beauty — purely for the joy of it. When Leo creates from the heart rather than for the applause, the result is always something magnificent." },
    ],
  },
  virgo: {
    personality: [
      "Virgo, the Maiden, approaches the world with a quiet precision and a devotion to service that often goes unnoticed by those who cannot see past the reserved exterior. As a mutable earth sign ruled by Mercury, those born between August 23 and September 22 combine the communicative intelligence of Mercury with the practical groundedness of earth, creating a sign that excels at turning abstract ideas into tangible improvements. Virgo is the editor of the zodiac, the one who takes raw material and refines it into something genuinely excellent. Their extraordinary eye for detail is not mere nitpicking but an expression of their deep belief that the world can always be better, that every system can be optimized, and that excellence is not a destination but a practice. Where others see good enough, Virgo sees the specific adjustments that would make it truly great.",
      "In relationships, Virgo loves through acts of practical devotion that speak louder than any grand romantic gesture. They remember how you take your coffee, notice when you are coming down with a cold before you do, organize your chaotic schedule without being asked, and quietly solve problems you did not even know you had. Their love is shown in the details: the perfectly chosen gift that proves they truly listened, the thoughtful advice that considers every angle, the steady presence that never wavers even when emotions run high. Virgo needs a partner who recognizes and appreciates these understated expressions of deep caring. Fellow earth signs Taurus and Capricorn understand Virgo's practical love language intuitively, while water sign Cancer provides the emotional warmth and domestic comfort that helps Virgo relax their ever-active mind.",
      "At work, Virgo is the indispensable team member that every successful organization relies upon, even if they rarely receive the flashy recognition given to more self-promotional signs. They excel in healthcare, research, editing, accounting, data analysis, project management, nutrition, veterinary science, and any field that demands meticulous attention to detail and a genuine desire to improve systems and outcomes. Virgo is the colleague who catches the error that would have cost the company thousands, the manager who creates efficient processes that save everyone time, and the professional who continues to develop their skills long after others have settled into complacency. Their Mercury rulership gives them exceptional analytical and communication abilities, allowing them to not only identify problems but explain their solutions clearly and persuasively.",
      "The growth journey for Virgo involves learning that perfection is an impossible standard and that their worth is not determined by their productivity or usefulness to others. Their tendency toward self-criticism, anxiety, and overwork stems from a deep-seated fear that they are not enough as they are, that they must constantly earn their place through service and improvement. The evolved Virgo discovers that the same gentle, discerning care they offer so freely to others must also be directed inward. When Virgo learns to apply their gift for refinement to their own self-talk, replacing harsh internal criticism with compassionate self-assessment, they unlock a level of peace and confidence that amplifies every other gift they possess. The Maiden's highest expression is not flawless execution but wholehearted service that flows from self-acceptance rather than self-punishment, creating a life that is not merely optimized but deeply, imperfectly, beautifully lived.",
    ],
    fortuneWisdom: [
      { fortune: "The smallest act of care can change someone's entire day", commentary: "Virgo's genius lies in the small things — the details that others overlook but that make all the difference. This fortune validates the Virgo approach to love and service, reminding them that their quiet, precise acts of caring ripple outward far more powerfully than they imagine." },
      { fortune: "Perfection is not the absence of flaws but the presence of love", commentary: "This is the fortune Virgo needs to read every morning. Their relentless pursuit of perfection can become a cage that prevents them from enjoying what they have already created. True perfection, this fortune suggests, is not about eliminating every flaw but about infusing every effort with genuine care and intention." },
      { fortune: "The healer must first tend to their own garden before nurturing others", commentary: "Mercury-ruled Virgo is the zodiac's natural healer and helper, but they often neglect their own needs in the process. This fortune is a gentle but firm reminder that self-care is not selfish — it is the foundation upon which all meaningful service to others is built." },
    ],
  },
  libra: {
    personality: [
      "Libra, the Scales, moves through life with an elegance and a commitment to fairness that elevates every interaction and environment they touch. As a cardinal air sign ruled by Venus, those born between September 23 and October 22 are endowed with a refined aesthetic sensibility, a natural talent for diplomacy, and a deep longing for harmony that shapes every aspect of their existence. Venus gives Libra an eye for beauty that extends far beyond the visual: they seek beauty in relationships, in ideas, in systems of justice, and in the way people treat one another. Their cardinal nature means they do not passively wish for balance but actively work to create it, often serving as the mediating force that brings opposing parties together and finds the common ground that others cannot see.",
      "In relationships, Libra truly comes alive. Partnership is not merely important to Libra — it is essential to their sense of self and their experience of the world. They are the sign most oriented toward one-on-one connection, and they bring to their relationships a grace, attentiveness, and genuine interest in their partner's perspective that makes the other person feel truly seen and valued. Libra courts with charm, maintains relationships with thoughtfulness, and navigates conflict with a diplomatic skill that can resolve tensions before they escalate. However, their desire to keep the peace can sometimes lead them to suppress their own needs or avoid necessary confrontations, creating an imbalance in the very relationships they are trying to keep harmonious. Air signs Gemini and Aquarius share Libra's intellectual approach to love, while fire sign Leo provides the confidence and decisiveness that helps Libra overcome their tendency toward indecision.",
      "Professionally, Libra thrives in roles that require negotiation, aesthetic judgment, interpersonal skill, and the ability to see all sides of an issue. Law, mediation, diplomacy, design, fashion, art curation, public relations, human resources, and event planning all play to Libra's natural strengths. They are the colleagues who can defuse office tensions with a well-timed word, the leaders who build consensus rather than imposing mandates, and the creatives who understand that true beauty is not decoration but the harmonious integration of form, function, and feeling. Libra's air-sign intellect gives them the ability to analyze situations objectively, while their Venus rulership ensures that their solutions are not just effective but elegant. Their challenge in professional settings is making decisions quickly enough; Libra's desire to weigh every option can sometimes slow progress when decisive action is needed.",
      "The deeper growth path for Libra involves learning that true harmony cannot be achieved by avoiding conflict but only by moving through it with honesty and courage. Their people-pleasing tendencies and fear of confrontation can lead them to sacrifice their authentic self on the altar of keeping others comfortable, creating a superficial peace that ultimately satisfies no one. The evolved Libra discovers that saying no is an act of love, that healthy conflict strengthens relationships rather than destroying them, and that the most beautiful balance is one that includes their own needs alongside everyone else's. When Libra learns to advocate for themselves with the same grace and conviction they bring to advocating for others, they achieve the genuine equilibrium they have been seeking all along. The Scales find their truest balance not by accommodating everyone but by standing firmly in their own truth while remaining open to the truths of others.",
    ],
    fortuneWisdom: [
      { fortune: "Harmony is not the absence of conflict but the presence of understanding", commentary: "Libra often equates peace with the absence of disagreement, but this fortune offers a more mature vision. True harmony, the kind Libra's soul truly craves, is built through understanding, not avoidance. It invites Libra to engage with conflict as a pathway to deeper connection rather than a threat to be neutralized." },
      { fortune: "The most beautiful decision is the one that honors your own heart", commentary: "Venus-ruled Libra has an extraordinary gift for considering others, but this fortune redirects that beautiful attention inward. Libra's chronic indecision often stems from trying to choose what will make everyone else happy. This fortune reminds them that the choice that truly honors their own heart is always the most graceful one." },
      { fortune: "Balance is not standing still but dancing with change", commentary: "The Scales symbol can suggest a static equilibrium, but this fortune redefines balance as a dynamic process. Libra's growth comes from understanding that life's beauty lies in its constant motion, and that true balance is the ability to move gracefully with change rather than resisting it in search of a stability that does not exist." },
    ],
  },
  scorpio: {
    personality: [
      "Scorpio, the Scorpion, inhabits the depths of human experience with an intensity and emotional courage that no other sign can match. As a fixed water sign traditionally ruled by Mars and modernly by Pluto, those born between October 23 and November 21 are drawn inexorably toward the hidden, the mysterious, and the transformative. Pluto, named for the god of the underworld, gives Scorpio an unflinching willingness to confront the darkest corners of the human psyche, including their own. They are not afraid of shadows, secrets, or the uncomfortable truths that others spend their lives avoiding. This is not morbidity but rather a profound understanding that real growth, real intimacy, and real power can only come from facing what lies beneath the surface. Scorpio sees through pretense with an almost x-ray perception, sensing motivations, hidden agendas, and unspoken feelings with an accuracy that can be both deeply comforting and deeply unnerving to those around them.",
      "In relationships, Scorpio loves with a totality that transforms both themselves and their partners. When a Scorpio lets you in, they give you access to an emotional depth and loyalty that is virtually unmatched in the zodiac. They are fiercely devoted, passionately protective, and capable of an intimacy so profound that it borders on the spiritual. However, they demand absolute honesty and emotional reciprocity from their partners, and betrayal, whether real or perceived, can unleash a fury and a capacity for emotional withdrawal that can be devastating. Scorpio needs a partner who is strong enough to meet them in the depths, someone who will not flinch from intensity and who values emotional truth above comfort. Fellow water signs Cancer and Pisces understand Scorpio's emotional landscape intuitively, while earth sign Virgo provides the grounded loyalty and practical devotion that gives Scorpio the security to be vulnerable.",
      "Professionally, Scorpio excels in any field that involves investigation, transformation, depth, or navigating complex power dynamics. Psychology, research, surgery, forensics, finance, crisis management, detective work, therapy, and strategic consulting all leverage Scorpio's natural gifts. They are the colleagues who uncover the root cause of a problem everyone else has been treating superficially, the leaders who transform struggling organizations through the sheer force of their vision and determination, and the professionals who thrive under pressure that would break more fragile signs. Scorpio's fixed nature gives them extraordinary persistence and focus, allowing them to pursue long-term goals with a single-minded dedication that produces results others consider impossible. Their strategic mind is always working several moves ahead, anticipating obstacles and positioning themselves for advantage.",
      "The growth edge for Scorpio lies in learning that control is an illusion and that vulnerability, not armor, is the source of their greatest power. Their tendency toward jealousy, secrecy, and emotional manipulation stems from a deep fear of being hurt or exposed, and the most transformative journey a Scorpio can undertake is learning to trust — to trust themselves, to trust their partners, and to trust that they can survive being seen in their most unguarded state. The Scorpion's famous capacity for transformation is not just about surviving crises but about voluntarily shedding the protective layers that no longer serve them. When Scorpio embraces the phoenix aspect of their nature, rising not from external destruction but from the deliberate release of their own defenses, they discover a freedom and a lightness that makes their already formidable presence truly transcendent. The depth they seek is ultimately the depth of their own self-acceptance.",
    ],
    fortuneWisdom: [
      { fortune: "What you seek in the shadows already lives in your light", commentary: "Pluto-ruled Scorpio is drawn to the hidden and the mysterious, constantly searching beneath surfaces for deeper truths. This fortune suggests that the profound meaning Scorpio relentlessly pursues in the depths is also available in the light, if they are willing to look. It is an invitation to balance their depth with a willingness to find wonder in simplicity." },
      { fortune: "True power is not control but the courage to be fully seen", commentary: "This fortune strikes at the heart of Scorpio's deepest challenge. The sign most associated with power often confuses it with control over others and over their own vulnerability. True power, this fortune argues, comes from the terrifying and liberating act of letting someone see you completely — exactly the transformation Scorpio's soul is designed to undergo." },
      { fortune: "Every ending you survive becomes a door you never knew existed", commentary: "No sign understands endings and rebirth like Scorpio. This fortune honors their lived experience of transformation — the knowledge, earned through many dark nights of the soul, that destruction and creation are inseparable, and that every loss they have endured has secretly been preparing them for something they could not have imagined." },
    ],
  },
  sagittarius: {
    personality: [
      "Sagittarius, the Archer, aims their arrow at the farthest horizon and never stops running toward it. As a mutable fire sign ruled by Jupiter, those born between November 22 and December 21 are animated by an expansive vision of life that sees possibility where others see limitation, adventure where others see risk, and meaning where others see random chaos. Jupiter, the largest planet in our solar system and the ancient king of the gods, bestows upon Sagittarius an abundance of optimism, generosity, and philosophical curiosity that makes them some of the most magnetic and inspiring people in the zodiac. They are not content to simply exist within the boundaries of their immediate world but are constantly reaching beyond them, whether through physical travel, intellectual exploration, spiritual seeking, or all three simultaneously.",
      "In relationships, Sagittarius brings a warmth, honesty, and sense of adventure that makes life with them feel like an endless expedition into the unknown. They are generous partners who share freely — their time, their resources, their wisdom, and their infectious laughter — and they need someone who can match their enthusiasm for growth and exploration. The biggest challenge in a Sagittarius relationship is their need for freedom and their fear of confinement. They do not do well with possessive or controlling partners, and any attempt to clip their wings will only make them fly further away. The ideal Sagittarius relationship feels like two independent adventurers who choose to share their journey, not because they need each other, but because the world is more fun together. Fellow fire signs Aries and Leo match Sagittarius's energy and passion, while air sign Aquarius provides the intellectual freedom and unconventional perspective that keeps the Archer endlessly fascinated.",
      "At work, Sagittarius gravitates toward careers that offer variety, intellectual stimulation, and the opportunity to broaden both their own horizons and those of others. Higher education, publishing, international business, travel, philosophy, outdoor recreation, motivational speaking, law, and cultural exchange programs all play to their strengths. They are the colleagues who bring fresh perspectives from unexpected sources, the leaders who inspire their teams with a compelling vision of what is possible, and the entrepreneurs who are willing to bet on bold ideas that more cautious minds reject. Sagittarius's mutable nature makes them remarkably adaptable and able to pivot quickly when circumstances change, a quality that proves invaluable in fast-moving, unpredictable fields. Their challenge is follow-through: the Archer is brilliant at launching initiatives but can lose interest once the initial excitement fades and the hard work of maintenance begins.",
      "The growth journey for Sagittarius involves learning that depth and commitment are not the enemies of freedom but actually its highest expression. Their tendency toward restlessness, tactlessness, and avoidance of emotional complexity often stems from a fear that standing still or going deeper will somehow diminish their expansive spirit. The evolved Sagittarius discovers that the most extraordinary adventures are not found on distant continents but in the uncharted territory of a long-term commitment, a difficult conversation, or a thorough examination of their own assumptions. When the Archer learns to aim their arrow not just outward but inward, exploring their own inner landscape with the same courage and curiosity they bring to the external world, they achieve the wisdom that Jupiter always intended them to find. The deepest truth Sagittarius seeks is not somewhere over the horizon — it has been traveling with them all along.",
    ],
    fortuneWisdom: [
      { fortune: "The greatest adventure begins when you stop running and start exploring where you stand", commentary: "Jupiter-ruled Sagittarius is always scanning the horizon for the next great adventure, but this fortune suggests that the most transformative journey may not require a passport. When the Archer pauses long enough to truly explore the depths of their present moment, they often discover it contains more wonder than any distant destination." },
      { fortune: "Share your truth generously, but remember that others have truths too", commentary: "Sagittarius is the zodiac's truth-teller, blessed with an honesty that is both refreshing and occasionally devastating. This fortune honors their commitment to truth while gently reminding them that their particular angle on reality, however valid, is not the only one. The wisest Archer speaks their truth and then listens." },
      { fortune: "Wisdom is not knowing all the answers but loving all the questions", commentary: "This fortune captures the essence of Sagittarius at their philosophical best. The Archer's lifelong quest for meaning is not about arriving at final answers but about the joy of the search itself. When Sagittarius embraces the questions as destinations in themselves, they find the contentment that has always eluded their restless spirit." },
    ],
  },
  capricorn: {
    personality: [
      "Capricorn, the Sea-Goat, climbs steadily toward the summit while keeping one hoof in the primordial depths. As a cardinal earth sign ruled by Saturn, those born between December 22 and January 19 are among the most ambitious, disciplined, and strategically minded people in the zodiac. Saturn, the planet of structure, limitation, and time, teaches Capricorn that anything worth having must be earned through sustained effort and that shortcuts inevitably lead to unstable foundations. This Saturnian influence gives Capricorn a maturity and seriousness that is often apparent even in childhood; they are the old souls of the zodiac, born with an innate understanding that the world rewards patience, responsibility, and the willingness to do the unglamorous work that others avoid. The mythological Sea-Goat — half mountain goat, half fish — suggests a creature equally at home on the highest peaks and in the deepest waters, and indeed Capricorn possesses both towering ambition and surprising emotional depth.",
      "In relationships, Capricorn is far more sentimental and devoted than their reserved exterior suggests. They show love not through flowery words or impulsive gestures but through consistent, reliable actions that build a foundation of trust and security over time. A Capricorn partner will work tirelessly to provide a stable home, remember their commitments without being reminded, and show up for every important moment with quiet dependability. They take relationships as seriously as they take their careers, viewing commitment as a solemn promise rather than a casual arrangement. What Capricorn needs in return is respect for their ambition, patience with their emotional guardedness, and a partner who understands that their reserve is not coldness but simply the way they protect their surprisingly tender heart. Fellow earth signs Taurus and Virgo share Capricorn's practical approach to love, while water sign Pisces offers the emotional depth and imagination that helps Capricorn access the feelings they often keep locked away.",
      "Professionally, Capricorn is in their element. The boardroom, the construction site, the government office, the financial institution — any setting that rewards hierarchy, expertise, and long-term strategic thinking is Capricorn territory. They are natural executives, administrators, architects, engineers, financial planners, and entrepreneurs who build empires from the ground up through sheer determination and intelligent planning. Capricorn does not rise to the top through luck or charm but through a work ethic so relentless and a competence so undeniable that advancement becomes inevitable. They respect tradition and institutional knowledge, understanding that established systems, while imperfect, contain hard-won wisdom that should be refined rather than discarded. Their challenge in professional settings is learning to delegate and to recognize that burnout is not a badge of honor but a sign that even the most capable climber needs to rest.",
      "The deeper lesson for Capricorn is that the summit they spend their life climbing is not the ultimate destination but merely a vantage point from which to appreciate the view. Their tendency toward pessimism, emotional repression, and workaholism stems from a deep fear that without their achievements and their usefulness, they are nothing. The evolved Capricorn discovers that they are worthy of love and belonging not because of what they have built but because of who they are at their core. When Saturn's most diligent student learns to balance ambition with self-compassion, discipline with joy, and responsibility with play, they become not just successful but genuinely fulfilled. The Sea-Goat's greatest achievement is not the empire they build or the mountain they climb but the moment they realize that their value was never in question and never depended on external validation. That realization, hard-won and deeply earned, is Capricorn's true crown.",
    ],
    fortuneWisdom: [
      { fortune: "The mountain does not judge how slowly you climb, only that you continue", commentary: "Saturn-ruled Capricorn can be brutally hard on themselves when progress feels slow, comparing their timeline to others and finding it lacking. This fortune offers the reassurance Capricorn rarely gives themselves: that their pace is irrelevant as long as they keep moving. The mountain respects persistence, not speed — and persistence is Capricorn's greatest gift." },
      { fortune: "Rest is not the enemy of ambition but its wisest ally", commentary: "This fortune directly challenges Capricorn's workaholic tendencies. The sign most likely to sacrifice sleep, health, and relationships in pursuit of their goals needs to hear that rest is not laziness but a strategic investment in sustained performance. Even the most determined climber must make camp to reach the summit." },
      { fortune: "Behind every great achievement stands a person who chose to enjoy the journey", commentary: "Capricorn often defers happiness until some future milestone is reached, living in a perpetual state of not-yet-enough. This fortune suggests that the truly great achievers are not those who grind joylessly toward the top but those who find meaning and pleasure in the climbing itself. It is an invitation for Capricorn to celebrate the present, not just the eventual destination." },
    ],
  },
  aquarius: {
    personality: [
      "Aquarius, the Water Bearer, pours the waters of knowledge and innovation upon a world that desperately needs both. As a fixed air sign traditionally ruled by Saturn and modernly by Uranus, those born between January 20 and February 18 are the zodiac's visionaries, reformers, and unconventional thinkers. Uranus, the planet of sudden insight, revolution, and radical originality, gives Aquarius a mind that operates on a different frequency from everyone else's. They see patterns others miss, question assumptions others accept blindly, and envision futures that seem impossible until an Aquarius makes them real. Their fixed nature might seem paradoxical for such a progressive sign, but it explains their absolute commitment to their ideals — once an Aquarius decides what they believe in, they will champion that cause with unwavering dedication, regardless of how unpopular or unconventional it may be.",
      "In relationships, Aquarius brings intellectual stimulation, fierce independence, and a loyalty that is expressed through respect rather than possession. They love by giving their partner complete freedom to be themselves, by engaging in deep conversations about ideas and ideals, and by standing beside their loved ones in the fight for causes they both believe in. Aquarius struggles with traditional expressions of emotional intimacy, not because they do not feel deeply but because they process emotions through their intellect rather than through conventional sentiment. They need a partner who understands that being given space is an act of love, not indifference, and who can match their need for intellectual partnership with emotional patience. Air signs Gemini and Libra speak Aquarius's intellectual language fluently, while fire sign Sagittarius shares their love of freedom, philosophical discussion, and resistance to conventional expectations.",
      "At work, Aquarius gravitates toward roles that allow them to innovate, disrupt, and contribute to the greater good. Technology, science, social activism, humanitarian organizations, invention, broadcasting, astrology, aviation, and any field at the cutting edge of human progress naturally attracts the Water Bearer. They are the colleagues who propose the idea that everyone initially rejects but later adopts, the leaders who build organizations around principles rather than profit alone, and the innovators who see technology as a tool for liberation rather than control. Aquarius's Saturn influence gives them more discipline and organizational ability than they are typically credited with, allowing them to turn their visionary ideas into practical realities. Their challenge is learning to work within existing systems long enough to change them from the inside, rather than always insisting on tearing everything down and starting from scratch.",
      "The growth path for Aquarius involves bridging the gap between their brilliant mind and their often-neglected emotional life. Their tendency toward detachment, contrarianism, and intellectual superiority can create an isolation that contradicts their genuine love for humanity. The paradox of Aquarius is that they care deeply about people in the abstract while sometimes struggling to connect with the specific humans right in front of them. The evolved Aquarius learns that emotional vulnerability is not irrational but profoundly human, and that the revolution they seek in the world must begin with a revolution in their own capacity for intimacy. When the Water Bearer learns to pour their waters not just upon the world at large but upon their own heart and closest relationships, they discover that the connection they have been seeking through ideas and ideals was available all along through simple, unguarded presence with another human being.",
    ],
    fortuneWisdom: [
      { fortune: "The future you envision begins with the connection you make today", commentary: "Uranus-ruled Aquarius is always looking ahead, envisioning a better world, but this fortune grounds their vision in the present moment. Grand futures are not built by solitary geniuses working in isolation but by people who connect, collaborate, and inspire one another today. The Water Bearer's vision needs human warmth to become reality." },
      { fortune: "Being different is not a burden but the very thing the world needs from you", commentary: "Aquarius has spent their life feeling out of step with the mainstream, and while they wear their uniqueness as a badge of honor, it can also feel lonely. This fortune affirms that their unconventional perspective is not a cosmic accident but a deliberate gift — the world needs people who see what others cannot, and Aquarius was born to fill that role." },
      { fortune: "The most revolutionary act is to love someone completely and without reservation", commentary: "This fortune challenges Aquarius at their deepest level. The sign that champions revolution, progress, and the transformation of society is invited to consider that the most radical act available to them is not intellectual or political but personal — the vulnerable, irrational, completely human act of loving another person without holding anything back." },
    ],
  },
  pisces: {
    personality: [
      "Pisces, the Fish, swims through the boundless ocean of consciousness with a grace and spiritual sensitivity that transcends the material world. As a mutable water sign ruled by Jupiter traditionally and Neptune in modern astrology, those born between February 19 and March 20 inhabit a reality far more expansive and multidimensional than what most people perceive. Neptune dissolves boundaries — between self and other, between dream and waking, between the visible and the invisible — giving Pisces an almost mystical ability to sense the interconnectedness of all things. They are the poets, the healers, the visionaries, and the empaths of the zodiac, possessing a depth of compassion and imaginative power that can transform suffering into art, confusion into wisdom, and isolation into universal connection. Where other signs navigate the world through logic, ambition, or social instinct, Pisces navigates through feeling, intuition, and a profound trust in forces that cannot be measured or explained.",
      "In relationships, Pisces loves with a selflessness and emotional depth that can feel transcendent for both partners. When a Pisces gives their heart, they give it without reservation, merging with their beloved on an emotional and sometimes spiritual level that creates an intimacy unlike anything found with other signs. They are extraordinarily attuned to their partner's needs, often sensing what is wrong before a word is spoken and providing comfort that feels almost magical in its timing and accuracy. Pisces romanticizes love, seeing in their partner the highest potential rather than the current flaws, which can be both inspiring and occasionally naive. They need a partner who appreciates their emotional depth without exploiting it, and who can provide the grounding presence that helps Pisces distinguish between intuition and wishful thinking. Fellow water signs Cancer and Scorpio understand the oceanic emotional landscape Pisces inhabits, while earth sign Capricorn provides the structure and stability that keeps Pisces from drifting too far into their inner world.",
      "Professionally, Pisces brings creativity, emotional intelligence, and an intuitive understanding of human nature to everything they do. They excel in the arts, music, film, photography, healing professions, counseling, social work, marine science, spirituality, and any field that values imagination and compassion over rigid structure. Pisces often finds that their greatest professional contributions come not from following conventional career paths but from allowing their unique gifts to guide them toward work that feels like a calling rather than a job. They are the counselors who sense what a client needs to hear, the artists who create work that moves people to tears, and the caregivers whose presence alone is healing. Jupiter's influence gives Pisces a broader vision and more resilience than they are often credited with, and when they commit their considerable creative gifts to a focused purpose, the results can be astonishingly powerful.",
      "The growth edge for Pisces lies in learning to maintain their extraordinary sensitivity without losing themselves in it. Their tendency toward escapism, emotional overwhelm, and blurred personal boundaries can leave them drained, confused, and disconnected from their own needs while being exquisitely attuned to everyone else's. The evolved Pisces discovers that boundaries are not barriers but channels that direct their oceanic compassion into forms that can actually help rather than simply absorb. When the Fish learns to swim with intention rather than being carried along by every current, they discover that their sensitivity, far from being a liability, is the most powerful healing force in the zodiac. The Piscean journey is ultimately about learning that dissolving into everything is not the same as connecting with everything, and that the most profound spiritual act is not transcending the self but inhabiting it fully — being completely present in this body, in this moment, in this beautifully imperfect human life.",
    ],
    fortuneWisdom: [
      { fortune: "Your dreams are not escapes from reality but blueprints for a better one", commentary: "Neptune-ruled Pisces is often told they are too dreamy, too impractical, too lost in fantasy. This fortune reframes their rich inner world as visionary rather than escapist. Many of the world's greatest innovations, works of art, and social movements began as someone's impossible dream — and Pisces is the sign most gifted at dreaming things into existence." },
      { fortune: "The ocean does not apologize for its depth, and neither should you", commentary: "Pisces often feels that their emotional intensity and sensitivity are too much for the world. This fortune is a declaration of permission: to feel deeply, to care profoundly, and to refuse to shrink their vast inner ocean to fit someone else's comfortable shallows. The depth that overwhelms others is precisely what makes Pisces extraordinary." },
      { fortune: "Healing others begins with the gentle act of healing yourself", commentary: "Pisces is the zodiac's natural healer, instinctively drawn to those in pain and gifted at easing suffering. But this fortune reminds them that the compassion they pour so freely upon others must also flow inward. The Pisces who tends to their own wounds first does not become less generous — they become a more sustainable and effective source of the healing the world so desperately needs." },
    ],
  },
};

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((z) => ({ sign: z.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sign: string }>;
}): Promise<Metadata> {
  const { sign } = await params;
  const zodiac = ZODIAC_SIGNS.find((z) => z.key === sign);
  if (!zodiac) return { title: "Zodiac Fortune" };

  const title = `${zodiac.symbol} ${zodiac.name} Fortune Today`;
  const description = `Daily fortune cookie message for ${zodiac.name} (${zodiac.dateRange}). Lucky numbers, personalized fortune, and cosmic guidance updated daily.`;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${SITE_URL}/zodiac/${sign}`,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/zodiac/${sign}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function ZodiacPage({
  params,
}: {
  params: Promise<{ sign: string }>;
}) {
  const { sign } = await params;
  const zodiac = ZODIAC_SIGNS.find((z) => z.key === sign);

  if (!zodiac) {
    return (
      <div className="bg-warm-gradient min-h-screen px-4 py-16 text-center text-foreground/50">
        Zodiac sign not found.
      </div>
    );
  }

  const signIndex = ZODIAC_SIGNS.indexOf(zodiac);
  const seed = dateSeed();
  const category = elementCategory[zodiac.element];
  const fortunes = getFortunesByCategory(category);

  // Today's zodiac fortune
  const rng = seededRandom(seed + signIndex);
  const fortuneIndex = Math.floor(rng() * fortunes.length);
  const fortune = fortunes[fortuneIndex];
  const rarityColor = getRarityColor(fortune.rarity);
  const rarityLabel = getRarityLabel(fortune.rarity);
  const elColor = elementColors[zodiac.element];

  // Lucky numbers: 6 unique numbers 1-49
  const numRng = seededRandom(seed * 300 + signIndex);
  const luckyNumbers: number[] = [];
  while (luckyNumbers.length < 6) {
    const n = Math.floor(numRng() * 49) + 1;
    if (!luckyNumbers.includes(n)) luckyNumbers.push(n);
  }
  luckyNumbers.sort((a, b) => a - b);

  const signTitle = zodiac.name;
  const profile = SIGN_PROFILES[sign];

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

  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Zodiac", url: `${SITE_URL}/zodiac/aries` },
          { name: signTitle, url: `${SITE_URL}/zodiac/${sign}` },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />

      <article className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">{zodiac.symbol}</div>
          <h1 className="text-golden-shimmer text-3xl sm:text-4xl font-bold mb-2">
            {signTitle} Fortune Today
          </h1>
          <p className="text-foreground/40 text-sm">{zodiac.dateRange}</p>
          <span
            className="mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: elColor }}
          >
            {zodiac.element} Sign
          </span>
        </div>

        {/* Today's Fortune */}
        <div
          className="relative overflow-hidden rounded-2xl border p-5 sm:p-8 text-center mb-10"
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
            Your {signTitle} Fortune
          </p>
          <p className="font-serif text-xl leading-relaxed text-cream">
            &ldquo;{fortune.text}&rdquo;
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: rarityColor }}
            >
              {rarityLabel}
            </span>
            <span className="text-xs text-foreground/30 capitalize">{category}</span>
          </div>
        </div>

        {/* About Sign */}
        {SIGN_DESCRIPTIONS[sign] && (
          <div className="rounded-2xl border border-border bg-background p-6 mb-10">
            <h2 className="text-lg font-semibold text-gold mb-3">About {signTitle}</h2>
            {profile ? (
              <div className="space-y-4">
                {profile.personality.map((paragraph, i) => (
                  <p key={i} className="text-sm text-muted leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted leading-relaxed">
                {SIGN_DESCRIPTIONS[sign].personality}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mt-6">
              <div>
                <p className="text-gold/70 font-medium mb-1">Strengths</p>
                <p className="text-muted">{SIGN_DESCRIPTIONS[sign].strengths}</p>
              </div>
              <div>
                <p className="text-gold/70 font-medium mb-1">Challenges</p>
                <p className="text-muted">{SIGN_DESCRIPTIONS[sign].challenges}</p>
              </div>
              <div>
                <p className="text-gold/70 font-medium mb-1">Best Matches</p>
                <p className="text-muted">{SIGN_DESCRIPTIONS[sign].bestMatches}</p>
              </div>
            </div>
          </div>
        )}

        {/* Fortune Cookie Wisdom */}
        {profile && (
          <section className="rounded-2xl border border-border bg-background p-6 mb-8">
            <h2 className="text-lg font-semibold text-gold mb-4">
              Fortune Cookie Wisdom for {signTitle}
            </h2>
            <div className="space-y-4">
              {profile.fortuneWisdom.map((fw, i) => (
                <div key={i} className="border-l-2 border-gold/30 pl-4">
                  <p className="text-sm font-serif italic text-cream mb-1">&ldquo;{fw.fortune}&rdquo;</p>
                  <p className="text-xs text-muted">{fw.commentary}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cross-links */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href={`/horoscope/daily/${sign}`} className="text-xs text-gold/60 hover:text-gold transition border border-border rounded-full px-3 py-1">
            {signTitle} Daily Horoscope →
          </Link>
          <Link href="/blog/zodiac-fortune-cookies-astrology-meets-wisdom" className="text-xs text-gold/60 hover:text-gold transition border border-border rounded-full px-3 py-1">
            Zodiac Fortune Cookies Article →
          </Link>
          <Link href="/blog" className="text-xs text-gold/60 hover:text-gold transition border border-border rounded-full px-3 py-1">
            Read More Articles →
          </Link>
        </div>

        {/* Lucky Numbers */}
        <div className="rounded-2xl border border-border bg-background p-6 text-center mb-10">
          <h2 className="text-lg font-semibold text-gold mb-4">
            Lucky Numbers for {signTitle}
          </h2>
          <div className="flex justify-center gap-3">
            {luckyNumbers.map((n) => (
              <div
                key={n}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-sm font-bold text-gold"
              >
                {n}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-foreground/30">Refreshes daily</p>
        </div>

        {/* CTA */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-block rounded-full bg-gold px-8 py-3 font-semibold text-background transition hover:bg-gold-light"
          >
            Break a Fortune Cookie
          </Link>
        </div>

        {/* Browse Other Signs */}
        <div className="border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-gold mb-4 text-center">
            Other Zodiac Signs
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {ZODIAC_SIGNS.filter((z) => z.key !== sign).map((z) => (
              <Link
                key={z.key}
                href={`/zodiac/${z.key}`}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground/50 transition hover:border-gold/30 hover:text-gold"
              >
                <span>{z.symbol}</span>
                <span>{z.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
