import type { Metadata } from "next";
import Link from "next/link";

interface BlogPost {
  title: string;
  date: string;
  readTime: string;
  content: string;
}

const posts: Record<string, BlogPost> = {
  "history-of-fortune-cookies": {
    title: "The Surprising History of Fortune Cookies",
    date: "2026-02-01",
    readTime: "5 min read",
    content: `
      <p>If you've ever cracked open a fortune cookie at the end of a Chinese restaurant meal, you might be surprised to learn that fortune cookies aren't actually from China. Their true origin is a fascinating tale that spans continents and cultures.</p>

      <h2>Japanese Roots</h2>
      <p>The most widely accepted theory traces fortune cookies back to Japanese immigrants in California during the late 19th and early 20th centuries. Japanese-style crackers called "tsujiura senbei" (fortune crackers) were sold in Kyoto as early as the 1870s, containing paper fortunes tucked inside.</p>

      <p>These traditional Japanese crackers were larger, made with miso and sesame rather than vanilla and butter, and were sold at temples and bakeries. When Japanese immigrants brought this tradition to America, the recipe was adapted to suit Western tastes.</p>

      <h2>The San Francisco Connection</h2>
      <p>Multiple people have claimed to have invented the American fortune cookie. Makoto Hagiwara, who designed the famous Japanese Tea Garden in San Francisco's Golden Gate Park, is believed to have served fortune cookies there as early as 1914. Another contender is David Jung, a Chinese immigrant who founded the Hong Kong Noodle Company in Los Angeles around 1918.</p>

      <p>The debate over the true inventor became so heated that in 1983, the Court of Historical Review in San Francisco actually held a mock trial to settle the matter. They ruled in favor of San Francisco (naturally), though Los Angeles disputed the verdict.</p>

      <h2>The Chinese Restaurant Connection</h2>
      <p>So how did a Japanese-American invention end up being associated with Chinese restaurants? During World War II, Japanese Americans were forcibly interned, and their businesses — including fortune cookie bakeries — were taken over or replicated by Chinese Americans. After the war, Chinese restaurants widely adopted fortune cookies as a complimentary dessert, and the association stuck.</p>

      <h2>Fortune Cookies Today</h2>
      <p>Today, approximately 3 billion fortune cookies are produced each year, with the vast majority consumed in the United States. Wonton Food Inc., based in Brooklyn, is the world's largest manufacturer, producing over 4.5 million fortune cookies per day.</p>

      <p>The fortunes themselves have evolved from profound Confucian-style wisdom to include lucky numbers, learning Chinese words, and even marketing messages. Some companies have even experimented with personalized digital fortunes — which is exactly what we've done here at Fortune Cookie!</p>

      <h2>The Digital Revolution</h2>
      <p>As technology advances, the fortune cookie experience is being reimagined for the digital age. Interactive web experiences, like ours, bring the tactile satisfaction of breaking a cookie into the browser with physics simulations and beautiful animations. While nothing quite replaces the crunch of a real cookie, there's something magical about discovering your fortune with the click of a mouse — and being able to share it instantly with the world.</p>
    `,
  },
  "fortune-cookie-traditions": {
    title: "Fortune Cookie Traditions Around the World",
    date: "2026-02-05",
    readTime: "4 min read",
    content: `
      <p>While fortune cookies are most associated with American Chinese restaurants, their influence has spread far and wide. Here's a look at how different cultures have embraced and adapted the fortune cookie tradition.</p>

      <h2>United States: A National Treasure</h2>
      <p>In America, fortune cookies are practically synonymous with Chinese takeout. They're so ingrained in the culture that many Americans are genuinely surprised to learn they're not traditionally Chinese. Beyond restaurants, fortune cookies have become popular at events like weddings, baby showers, and corporate gatherings, where custom messages add a personal touch.</p>

      <h2>Japan: The Original Tradition</h2>
      <p>In Japan, the tradition of tsujiura senbei continues in some Kyoto bakeries, though they're quite different from their American cousins. These larger, darker crackers are sold at shrines and temples, and their fortunes tend to be more spiritual in nature.</p>

      <h2>Brazil: Biscoito da Sorte</h2>
      <p>Brazil has enthusiastically adopted fortune cookies, calling them "biscoitos da sorte." They're particularly popular at Japanese-Brazilian cultural celebrations and have found their way into mainstream Brazilian party culture, often with fortunes written in Portuguese.</p>

      <h2>Wedding Fortune Cookies</h2>
      <p>One of the most charming adaptations of fortune cookies is their use at weddings. Couples create custom fortune cookies with personalized messages of love, relationship advice, or inside jokes. The cookies might be dipped in chocolate, decorated with sprinkles, or wrapped in the wedding colors.</p>

      <h2>Corporate Fortune Cookies</h2>
      <p>Businesses have discovered the marketing potential of fortune cookies. Custom fortune cookies with branded messages, product announcements, or motivational quotes have become popular promotional items. Tech companies in Silicon Valley are particularly fond of using them at launch events and conferences.</p>

      <h2>Digital Fortune Cookies</h2>
      <p>The latest evolution in fortune cookie culture is the digital fortune cookie. Websites and apps now offer virtual cookie-breaking experiences, combining the anticipation and surprise of traditional fortune cookies with shareable social content. Our own Fortune Cookie site is part of this growing trend, using cutting-edge web technology to create an experience that's both nostalgic and fresh.</p>
    `,
  },
  "building-interactive-web-games": {
    title: "Building Interactive Web Games with Physics Engines",
    date: "2026-02-08",
    readTime: "7 min read",
    content: `
      <p>Creating an interactive web experience with realistic physics isn't as daunting as it might seem. In this post, we'll explore the technologies behind our fortune cookie game and how you can use similar techniques in your own projects.</p>

      <h2>The Tech Stack</h2>
      <p>Our fortune cookie uses three main technologies for its interactive elements: Pixi.js for rendering, Matter.js for physics, and GSAP for animations. Each serves a specific purpose in creating the overall experience.</p>

      <h2>Pixi.js: The Visual Engine</h2>
      <p>Pixi.js is a fast 2D rendering engine that uses WebGL (with a Canvas fallback). It handles drawing everything you see on screen — the cookie, the fragments, the particles, and the fortune paper. With Pixi.js, we can maintain smooth 60fps animations even with dozens of moving objects on screen.</p>

      <p>The key advantage of Pixi.js over plain Canvas 2D is performance. WebGL leverages your GPU for rendering, which means complex scenes with many objects can still run smoothly. For our fortune cookie, this means each cookie fragment, particle, and visual effect can be rendered independently without performance issues.</p>

      <h2>Matter.js: The Physics</h2>
      <p>Matter.js is a 2D rigid body physics engine that handles the realistic behavior of cookie fragments after breaking. When you smash a cookie, Matter.js calculates how each piece should fly, spin, bounce off walls, and eventually settle.</p>

      <p>Key physics concepts we use include gravity (fragments fall downward), restitution (fragments bounce when they hit surfaces), friction (fragments eventually stop moving), and impulse forces (the initial explosion force that sends fragments flying).</p>

      <h2>GSAP: The Polish</h2>
      <p>GSAP (GreenSock Animation Platform) handles the UI animations that don't need physics — screen shake, the fortune paper reveal, button animations, and text effects. GSAP excels at precisely timed, sequenced animations with easing functions that make movements feel natural.</p>

      <h2>Voronoi Fragmentation</h2>
      <p>One of the most interesting technical challenges was creating realistic cookie fragments. We use a simplified Voronoi-like algorithm to split the cookie shape into irregular pieces. This creates fragments that look naturally broken rather than having uniform geometric shapes.</p>

      <h2>Interaction Detection</h2>
      <p>Supporting five different breaking methods required a sophisticated interaction detection system. We track mouse position, velocity, click timing, and hold duration to distinguish between a click smash, drag crack, shake break, double-tap, and squeeze. Each method produces different fragment patterns and force distributions.</p>

      <h2>Performance Considerations</h2>
      <p>Running a physics engine, a rendering engine, and particle effects simultaneously can be demanding. We optimize by limiting the number of fragments and particles, using efficient collision detection boundaries, and cleaning up objects that have left the visible area. The result is a smooth experience even on mobile devices.</p>
    `,
  },
  "psychology-of-fortune-telling": {
    title: "The Psychology Behind Fortune Telling and Why We Love It",
    date: "2026-02-10",
    readTime: "6 min read",
    content: `
      <p>Why do we find fortune cookies so delightful? The answer lies deep in human psychology — in our innate desire to find meaning, the thrill of uncertainty, and a fascinating cognitive bias called the Barnum effect.</p>

      <h2>The Barnum Effect</h2>
      <p>Named after showman P.T. Barnum, the Barnum effect (also called the Forer effect) is our tendency to accept vague, general personality descriptions as uniquely accurate descriptions of ourselves. When a fortune cookie says "A pleasant surprise is in store for you," almost everyone can find a way to make it feel personally relevant.</p>

      <p>Psychologist Bertram Forer demonstrated this in 1948 by giving students identical personality profiles and asking them to rate the accuracy. The average rating was 4.26 out of 5 — people overwhelmingly felt the generic description was uniquely accurate for them.</p>

      <h2>The Anticipation Factor</h2>
      <p>Research shows that anticipation of an event can be more pleasurable than the event itself. The ritual of cracking open a fortune cookie — the buildup, the reveal, the reading — creates a mini anticipation-reward cycle. Our brains release dopamine not just when we read the fortune, but during the anticipation of reading it.</p>

      <p>This is why the interactive breaking experience matters so much. By adding physics, sound effects, and animation, we extend the anticipation phase, making the eventual reveal more satisfying.</p>

      <h2>Optimism Bias</h2>
      <p>Fortune cookies are almost universally positive, and this aligns with our natural optimism bias — the tendency to believe that good things are more likely to happen to us than bad things. When we read a positive fortune, our optimism bias makes us more likely to believe it, creating a small but real mood boost.</p>

      <h2>The Illusion of Control</h2>
      <p>There's something psychologically satisfying about the act of choosing and breaking a cookie. Even though the fortune inside is predetermined, the physical act of breaking gives us a sense of agency — a feeling that we've influenced the outcome. This illusion of control makes the experience more engaging and the fortune more meaningful.</p>

      <h2>Social Bonding</h2>
      <p>Fortune cookies are inherently social. The tradition of reading fortunes aloud at a dinner table creates shared experiences and conversation. This social element is why fortune sharing features are so popular — they extend the communal experience beyond the dinner table and into the digital world.</p>

      <h2>Why Digital Fortune Cookies Work</h2>
      <p>Digital fortune cookies tap into all these psychological principles. The interactive breaking mechanics provide agency and anticipation. The varied fortune categories and rarity system add an element of surprise and collection. The sharing features enable social bonding. And the daily fortune creates a ritual that leverages our love of routine and habit.</p>
    `,
  },
  "digital-fortune-cookies-future": {
    title: "The Future of Digital Fortune Cookies",
    date: "2026-02-10",
    readTime: "4 min read",
    content: `
      <p>The fortune cookie has come a long way from its origins in Kyoto bakeries. As technology continues to evolve, so too does the potential for reimagining this beloved tradition. Here's what the future might hold.</p>

      <h2>AI-Personalized Fortunes</h2>
      <p>Imagine a fortune cookie that knows you. With advances in AI, future fortune cookies could generate truly personalized messages based on your interests, goals, and current life situation. Rather than generic wisdom, you might receive specific encouragement related to your career change, creative project, or personal growth journey.</p>

      <h2>Augmented Reality Cookies</h2>
      <p>AR technology could bring fortune cookies into the physical world in new ways. Point your phone at a real fortune cookie and watch it digitally crack apart with dramatic effects. Or see your fortune materialize as floating 3D text above the cookie — complete with particles and animations.</p>

      <h2>Social Fortune Experiences</h2>
      <p>Future digital fortune cookies might become multiplayer experiences. Break a cookie simultaneously with friends around the world and compare fortunes in real time. Fortune-based challenges, where friends compete to collect rare fortunes, could add a gamification layer to the experience.</p>

      <h2>Fortune NFTs and Digital Collectibles</h2>
      <p>The concept of fortune rarity could extend into digital collectibles. Rare or legendary fortunes could become unique digital items that users can collect, trade, or display. While the NFT market has cooled, the underlying concept of digital scarcity and collectibility remains compelling.</p>

      <h2>Voice-Activated Fortunes</h2>
      <p>Smart speakers and voice assistants could offer fortune cookie experiences triggered by voice. "Hey Siri, break my fortune cookie" could trigger an audio experience complete with cracking sounds and a dramatically read fortune.</p>

      <h2>Therapeutic Fortune Cookies</h2>
      <p>There's growing interest in using positive affirmations and micro-interventions for mental health. Fortune cookies, with their tradition of positive messages, could evolve into therapeutic tools — delivering evidence-based positive psychology interventions disguised as playful fortune messages.</p>

      <h2>What We're Building</h2>
      <p>At Fortune Cookie, we're excited about the future. Our current experience with physics-based breaking and curated fortunes is just the beginning. We're exploring AI-generated fortunes, seasonal themes, and social features that will make each visit more engaging. Stay tuned — the best fortunes are yet to come.</p>
    `,
  },
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) {
    return { title: "Post Not Found" };
  }
  return {
    title: post.title,
    description: post.content.slice(0, 160).replace(/<[^>]*>/g, "").trim(),
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return (
      <div className="bg-warm-gradient flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-golden-shimmer mb-4 text-4xl font-bold">Post Not Found</h1>
          <Link href="/blog" className="text-gold underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1 text-sm text-foreground/40 transition hover:text-gold"
        >
          ← Back to Blog
        </Link>

        <header className="mb-8">
          <h1 className="text-golden-shimmer mb-3 text-3xl font-bold md:text-4xl">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-foreground/30">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <div
          className="prose prose-invert max-w-none space-y-4 text-foreground/70 leading-relaxed [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gold [&_p]:mb-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 border-t border-gold/10 pt-8">
          <Link href="/blog" className="text-gold transition hover:text-gold-light">
            ← Read more articles
          </Link>
        </div>
      </article>
    </div>
  );
}
