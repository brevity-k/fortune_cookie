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
    readTime: "6 min read",
    content: `
      <p>If you've ever cracked open a fortune cookie at the end of a Chinese restaurant meal, you might be surprised to learn that fortune cookies aren't actually from China. Their true origin is a fascinating tale that spans continents, cultures, and more than a century of culinary history. From humble temple snacks in Kyoto to the most recognizable dessert in American Chinese cuisine, the fortune cookie's journey is anything but ordinary.</p>

      <h2>Japanese Roots</h2>
      <p>The most widely accepted theory traces fortune cookies back to Japanese immigrants in California during the late 19th and early 20th centuries. Japanese-style crackers called "tsujiura senbei" (fortune crackers) were sold in Kyoto as early as the 1870s, containing paper fortunes tucked inside. These crackers were a common sight near Shinto shrines, where visitors would purchase them as a form of omikuji — random fortunes that are a deeply rooted part of Japanese spiritual life.</p>

      <p>These traditional Japanese crackers were larger, made with miso and sesame rather than vanilla and butter, and were sold at temples and bakeries. The fortunes inside were often spiritual predictions or poetic verses rather than the inspirational one-liners we know today. When Japanese immigrants brought this tradition to America, the recipe was adapted to suit Western tastes, becoming sweeter and lighter with the addition of vanilla extract and butter.</p>

      <h2>The San Francisco Connection</h2>
      <p>Multiple people have claimed to have invented the American fortune cookie. Makoto Hagiwara, who designed the famous Japanese Tea Garden in San Francisco's Golden Gate Park, is believed to have served fortune cookies there as early as 1914. He reportedly commissioned a local bakery, Benkyodo, to produce the cookies as thank-you gifts for visitors to the garden. Another contender is David Jung, a Chinese immigrant who founded the Hong Kong Noodle Company in Los Angeles around 1918. Jung claimed he created the cookies to distribute to the homeless near his shop, each containing an uplifting scripture passage.</p>

      <p>The debate over the true inventor became so heated that in 1983, the Court of Historical Review in San Francisco actually held a mock trial to settle the matter. A key piece of evidence was a set of iron cookie molds from Benkyodo bakery, dating back to the early 1900s. The court ruled in favor of San Francisco (naturally), though Los Angeles disputed the verdict. To this day, the question of origin remains a topic of friendly rivalry between the two cities.</p>

      <h2>The Chinese Restaurant Connection</h2>
      <p>So how did a Japanese-American invention end up being associated with Chinese restaurants? During World War II, Japanese Americans were forcibly interned under Executive Order 9066, and their businesses — including fortune cookie bakeries — were taken over or replicated by Chinese Americans who saw an opportunity. After the war, Chinese restaurants widely adopted fortune cookies as a complimentary dessert, and the association stuck. By the 1960s, fortune cookies were a standard offering at nearly every Chinese restaurant in the United States, and most Americans had no idea the tradition wasn't Chinese at all.</p>

      <p>Interestingly, when fortune cookies were introduced in China in the 1990s, they were marketed as "genuine American fortune cookies" — a humorous twist that highlights how thoroughly the cookie had become an American invention despite its Asian roots.</p>

      <h2>Fortune Cookies Today</h2>
      <p>Today, approximately 3 billion fortune cookies are produced each year, with the vast majority consumed in the United States. Wonton Food Inc., based in Brooklyn, is the world's largest manufacturer, producing over 4.5 million fortune cookies per day. The company employs a team of writers who craft hundreds of new fortunes every year, cycling through thousands of messages to keep things fresh for repeat diners.</p>

      <p>The fortunes themselves have evolved from profound Confucian-style wisdom to include lucky numbers, learning Chinese words, and even marketing messages. Some companies have even experimented with personalized digital fortunes — which is exactly what we've done here at Fortune Cookie! The range of fortunes now spans from classic philosophical musings to humorous quips, romantic advice, and career encouragement.</p>

      <h2>The Digital Revolution</h2>
      <p>As technology advances, the fortune cookie experience is being reimagined for the digital age. Interactive web experiences, like ours, bring the tactile satisfaction of breaking a cookie into the browser with physics simulations and beautiful animations. Modern rendering engines and physics libraries make it possible to recreate the satisfying crack of a real cookie, complete with fragments that scatter realistically across the screen.</p>

      <p>While nothing quite replaces the crunch of a real cookie, there's something magical about discovering your fortune with the click of a mouse — and being able to share it instantly with the world. Digital fortune cookies also unlock possibilities that physical ones never could: rarity systems, daily fortunes that connect a global community, streak rewards for returning visitors, and an ever-growing collection of wisdom from around the world.</p>
    `,
  },
  "fortune-cookie-traditions": {
    title: "Fortune Cookie Traditions Around the World",
    date: "2026-02-05",
    readTime: "5 min read",
    content: `
      <p>While fortune cookies are most associated with American Chinese restaurants, their influence has spread far and wide across the globe. From São Paulo to Tokyo, people have found their own ways to embrace the simple joy of cracking open a cookie and discovering a hidden message. Here's a look at how different cultures have adopted and adapted the fortune cookie tradition.</p>

      <h2>United States: A National Treasure</h2>
      <p>In America, fortune cookies are practically synonymous with Chinese takeout. They're so ingrained in the culture that many Americans are genuinely surprised to learn they're not traditionally Chinese. The ritual of cracking open a cookie, reading the fortune aloud, and adding "in bed" to the end has become a beloved dinner table game that transcends generations.</p>

      <p>Beyond restaurants, fortune cookies have become popular at events like weddings, baby showers, and corporate gatherings, where custom messages add a personal touch. Specialty bakeries now offer fortune cookies in dozens of flavors — from matcha and chocolate to strawberry and peanut butter — and colors to match any event's theme. Some couples even use fortune cookies as creative vehicles for gender reveal announcements or marriage proposals.</p>

      <h2>Japan: The Original Tradition</h2>
      <p>In Japan, the tradition of tsujiura senbei continues in some Kyoto bakeries, though they're quite different from their American cousins. These larger, darker crackers are sold at shrines and temples, and their fortunes tend to be more spiritual in nature, often resembling the omikuji fortune slips found at Shinto shrines. The Fushimi Inari shrine bakery in Kyoto is one of the few places where you can still find these traditional fortune crackers made by hand using iron grills over an open flame.</p>

      <p>Japanese fortune crackers are also folded differently — they're shaped more like a rounded figure-eight — and the flavor profile leans savory with sesame, miso, and rice flour rather than the sweet vanilla taste Westerners know. Visitors to Japan are often fascinated to discover this original form of the fortune cookie that most of the world has never tasted.</p>

      <h2>Brazil: Biscoito da Sorte</h2>
      <p>Brazil has enthusiastically adopted fortune cookies, calling them "biscoitos da sorte." The country is home to one of the largest Japanese diaspora communities outside Japan, and the fusion of Japanese and Brazilian cultures created the perfect environment for fortune cookies to thrive. They're particularly popular at Japanese-Brazilian cultural celebrations, Carnival festivities, and birthday parties, and have found their way into mainstream Brazilian party culture, often with fortunes written in Portuguese.</p>

      <p>Brazilian fortune cookie companies have added their own flair, offering cookies in tropical flavors like coconut and passion fruit, and fortunes that reference local proverbs, song lyrics, and popular cultural expressions. Some bakeries in São Paulo produce thousands of custom fortune cookies daily for corporate events and celebrations.</p>

      <h2>Wedding Fortune Cookies</h2>
      <p>One of the most charming adaptations of fortune cookies is their use at weddings around the world. Couples create custom fortune cookies with personalized messages of love, relationship advice, or inside jokes that guests can enjoy as wedding favors. The cookies might be dipped in white or dark chocolate, decorated with sprinkles or edible gold dust, or wrapped in fabric that matches the wedding colors.</p>

      <p>In some cultures, wedding fortune cookies contain specific blessings for the couple. Italian-American weddings sometimes feature fortune cookies alongside traditional Jordan almonds, with each cookie containing a toast or well-wish from a different family member. This personal touch transforms a simple dessert into a meaningful keepsake that guests remember long after the celebration ends.</p>

      <h2>Corporate Fortune Cookies</h2>
      <p>Businesses have discovered the marketing potential of fortune cookies. Custom fortune cookies with branded messages, product announcements, or motivational quotes have become popular promotional items at trade shows and corporate events. Tech companies in Silicon Valley are particularly fond of using them at product launches and conferences, sometimes embedding QR codes in the fortune slips that link to special offers or exclusive content.</p>

      <p>Real estate agents, car dealerships, and financial advisors have also embraced fortune cookies as a creative leave-behind that's far more memorable than a standard business card. The novelty factor ensures the brand message gets read, and the positive associations with fortune cookies create a warm impression of the company.</p>

      <h2>Digital Fortune Cookies</h2>
      <p>The latest evolution in fortune cookie culture is the digital fortune cookie. Websites and apps now offer virtual cookie-breaking experiences, combining the anticipation and surprise of traditional fortune cookies with shareable social content. These platforms can offer features impossible with physical cookies: daily community fortunes, rarity systems, streak rewards, and instant sharing to social media.</p>

      <p>Our own Fortune Cookie site is part of this growing trend, using cutting-edge web technology to create an experience that's both nostalgic and fresh. With physics-based breaking, multiple interaction methods, and over a thousand curated fortunes, we're carrying forward a tradition that has connected people across cultures for more than a century.</p>
    `,
  },
  "building-interactive-web-games": {
    title: "Building Interactive Web Games with Physics Engines",
    date: "2026-02-08",
    readTime: "7 min read",
    content: `
      <p>Creating an interactive web experience with realistic physics isn't as daunting as it might seem. Modern JavaScript libraries have made it remarkably accessible to build browser-based games and simulations that would have required native applications just a decade ago. In this post, we'll explore the technologies behind our fortune cookie game and how you can use similar techniques in your own projects.</p>

      <h2>The Tech Stack</h2>
      <p>Our fortune cookie uses three main technologies for its interactive elements: Pixi.js for rendering, Matter.js for physics, and GSAP for animations. Each serves a specific purpose in creating the overall experience, and together they form a powerful combination that can handle everything from simple button animations to complex physics simulations with dozens of interacting objects.</p>

      <h2>Pixi.js: The Visual Engine</h2>
      <p>Pixi.js is a fast 2D rendering engine that uses WebGL (with a Canvas fallback). It handles drawing everything you see on screen — the cookie, the fragments, the particles, and the fortune paper. With Pixi.js, we can maintain smooth 60fps animations even with dozens of moving objects on screen. The library abstracts away the complexity of working directly with the WebGL API, providing a friendly scene graph and sprite-based architecture that feels intuitive to web developers.</p>

      <p>The key advantage of Pixi.js over plain Canvas 2D is performance. WebGL leverages your GPU for rendering, which means complex scenes with many objects can still run smoothly. For our fortune cookie, this means each cookie fragment, particle, and visual effect can be rendered independently without performance issues. Pixi.js also handles DPI scaling automatically, so the experience looks crisp on high-resolution retina displays without any extra work from the developer.</p>

      <p>Setting up a Pixi.js application involves creating an Application instance, configuring the renderer with your desired resolution and background color, and adding display objects to the stage. Display objects can be sprites, graphics (shapes drawn with code), text, or containers that group other objects together. The rendering loop runs automatically at the display's refresh rate, redrawing the scene every frame.</p>

      <h2>Matter.js: The Physics</h2>
      <p>Matter.js is a 2D rigid body physics engine that handles the realistic behavior of cookie fragments after breaking. When you smash a cookie, Matter.js calculates how each piece should fly, spin, bounce off walls, and eventually settle. The engine runs its own simulation loop, updating the position and rotation of every physics body at each timestep based on the forces acting on it.</p>

      <p>Key physics concepts we use include gravity (fragments fall downward), restitution (fragments bounce when they hit surfaces — a value of 1.0 means a perfectly elastic bounce, while 0 means no bounce at all), friction (fragments eventually stop moving as energy is lost to surface contact), and impulse forces (the initial explosion force that sends fragments flying outward from the break point).</p>

      <p>One important detail is that Matter.js handles the physics simulation, but it doesn't draw anything. The rendering is entirely handled by Pixi.js. On each animation frame, we read the position and angle of every Matter.js body and update the corresponding Pixi.js graphics object to match. This separation of physics and rendering is a common pattern in game development that allows each system to be optimized independently.</p>

      <h2>GSAP: The Polish</h2>
      <p>GSAP (GreenSock Animation Platform) handles the UI animations that don't need physics — screen shake, the fortune paper reveal, button animations, and text effects. GSAP excels at precisely timed, sequenced animations with easing functions that make movements feel natural. Unlike CSS animations, GSAP provides fine-grained control over timing, allows animations to be chained into complex sequences, and performs consistently across all browsers.</p>

      <p>For the fortune cookie experience, GSAP powers the screen shake effect when the cookie breaks — a subtle but impactful detail that adds visceral feedback to the interaction. It also handles the smooth reveal of the fortune text, the fade-in of share buttons, and the pulsing glow effects on interactive elements. These polishing touches might seem small individually, but together they transform a functional prototype into a delightful experience.</p>

      <h2>Voronoi Fragmentation</h2>
      <p>One of the most interesting technical challenges was creating realistic cookie fragments. We use a simplified Voronoi-like algorithm to split the cookie shape into irregular pieces. The algorithm works by placing random seed points within the cookie's circular boundary, then creating wedge-shaped regions around each point. Random vertex offsets are added to make the edges irregular, producing fragments that look naturally broken rather than having uniform geometric shapes.</p>

      <p>Each fragment is assigned one of eight distinct cookie colors to create visual variety, and the fragment shapes are used to create both the Pixi.js graphics for rendering and the Matter.js bodies for physics simulation. The result is a convincing break effect where every crack looks unique — no two cookie breaks are ever quite the same.</p>

      <h2>Interaction Detection</h2>
      <p>Supporting five different breaking methods required a sophisticated interaction detection system. We use the Pointer Events API, which provides a unified interface for mouse, touch, and pen input. The system tracks mouse position, velocity, click timing, and hold duration to distinguish between a click smash (three progressive clicks), drag crack (40-pixel drag threshold), shake break (rapid mouse movement velocity), double-tap (instant break), and squeeze (2-second hold). Each method produces different fragment patterns and force distributions, making the chosen method feel distinct and satisfying.</p>

      <h2>Performance Considerations</h2>
      <p>Running a physics engine, a rendering engine, and particle effects simultaneously can be demanding, especially on mobile devices with limited processing power. We optimize by limiting the number of fragments to 8-12 pieces per cookie, capping particle counts, using efficient collision detection boundaries defined by simple convex polygons, and cleaning up objects that have left the visible area. Physics bodies that settle and stop moving are put to sleep by Matter.js, reducing computation.</p>

      <p>We also use dynamic imports in Next.js to load the interactive components only when needed, preventing the heavy Pixi.js and Matter.js libraries from blocking the initial page render. The result is a smooth experience that loads fast and runs well even on mid-range mobile devices.</p>
    `,
  },
  "psychology-of-fortune-telling": {
    title: "The Psychology Behind Fortune Telling and Why We Love It",
    date: "2026-02-10",
    readTime: "6 min read",
    content: `
      <p>Why do we find fortune cookies so delightful? The answer lies deep in human psychology — in our innate desire to find meaning, the thrill of uncertainty, and a fascinating cognitive bias called the Barnum effect. Understanding these psychological mechanisms helps explain why a simple cookie with a slip of paper inside has captivated millions of people for over a century, and why the experience translates so effectively to the digital world.</p>

      <h2>The Barnum Effect</h2>
      <p>Named after showman P.T. Barnum, the Barnum effect (also called the Forer effect) is our tendency to accept vague, general personality descriptions as uniquely accurate descriptions of ourselves. When a fortune cookie says "A pleasant surprise is in store for you," almost everyone can find a way to make it feel personally relevant. Our minds naturally search for connections between the fortune's words and our own circumstances, creating a sense of personal significance from what is essentially a universal statement.</p>

      <p>Psychologist Bertram Forer demonstrated this in 1948 by giving students identical personality profiles and asking them to rate the accuracy. The average rating was 4.26 out of 5 — people overwhelmingly felt the generic description was uniquely accurate for them. This experiment has been replicated hundreds of times with consistently similar results, confirming that the Barnum effect is a robust and universal feature of human cognition rather than a quirk of any particular culture or demographic.</p>

      <p>Fortune cookie writers have intuitively understood this principle for decades. The best fortunes strike a balance between being specific enough to feel meaningful and vague enough to apply to anyone. Phrases like "Your hard work will soon pay off" or "An important person will offer you support" resonate because nearly everyone can map them onto their own life situation.</p>

      <h2>The Anticipation Factor</h2>
      <p>Research in neuroscience shows that anticipation of an event can be more pleasurable than the event itself. The ritual of cracking open a fortune cookie — the buildup, the crack, the reveal, the reading — creates a mini anticipation-reward cycle. Our brains release dopamine not just when we read the fortune, but during the anticipation of reading it. This is the same neurological mechanism that makes unwrapping gifts exciting and keeps people pulling slot machine levers.</p>

      <p>This is why the interactive breaking experience matters so much. By adding physics, sound effects, and animation, we extend the anticipation phase, making the eventual reveal more satisfying. The crack sound, the scattering fragments, the brief pause before the fortune appears — each step builds anticipation and amplifies the dopamine release when the message is finally revealed. Studies have shown that even small delays of a few seconds can significantly increase the perceived value of a reward.</p>

      <h2>Optimism Bias</h2>
      <p>Fortune cookies are almost universally positive, and this aligns with our natural optimism bias — the tendency to believe that good things are more likely to happen to us than bad things. Neuroscientist Tali Sharot's research at University College London has shown that approximately 80% of people exhibit optimism bias, regardless of age, gender, or nationality. When we read a positive fortune, our optimism bias makes us more likely to believe it, creating a small but real mood boost.</p>

      <p>This is also why negative fortune cookies feel so wrong. A fortune that says "Expect disappointment tomorrow" would violate our expectations and leave a bad taste — literally and figuratively. The positive framing of fortune cookies works with our cognitive biases rather than against them, creating a consistently pleasant experience that keeps people coming back.</p>

      <h2>The Illusion of Control</h2>
      <p>There's something psychologically satisfying about the act of choosing and breaking a cookie. Even though the fortune inside is predetermined, the physical act of breaking gives us a sense of agency — a feeling that we've influenced the outcome. Psychologist Ellen Langer's research on the illusion of control showed that people feel more confident about outcomes they've physically interacted with, even when the interaction has zero effect on the result. This illusion of control makes the experience more engaging and the fortune more meaningful.</p>

      <p>In our digital fortune cookie, we amplify this effect by offering five different ways to break the cookie. Whether you click, drag, shake, double-tap, or squeeze, the chosen method feels intentional and personal, as if the way you broke the cookie somehow influenced which fortune you received.</p>

      <h2>Social Bonding</h2>
      <p>Fortune cookies are inherently social. The tradition of reading fortunes aloud at a dinner table creates shared experiences and conversation starters. People compare fortunes, laugh at absurd ones, and debate the wisdom of profound ones. This social element is why fortune sharing features are so popular — they extend the communal experience beyond the dinner table and into the digital world, allowing friends and followers to participate in the ritual regardless of physical distance.</p>

      <h2>Why Digital Fortune Cookies Work</h2>
      <p>Digital fortune cookies tap into all these psychological principles simultaneously. The interactive breaking mechanics provide agency and anticipation. The varied fortune categories and rarity system add an element of surprise and collection — tapping into the same completionist drive that makes trading cards and achievement systems so compelling. The sharing features enable social bonding. And the daily fortune creates a ritual that leverages our love of routine and habit, giving visitors a reason to return each day and see what the universe has in store.</p>
    `,
  },
  "digital-fortune-cookies-future": {
    title: "The Future of Digital Fortune Cookies",
    date: "2026-02-10",
    readTime: "5 min read",
    content: `
      <p>The fortune cookie has come a long way from its origins in Kyoto bakeries. What started as a temple snack with handwritten fortunes has evolved into a global cultural phenomenon, and the digital age is opening up possibilities that would have seemed like science fiction just a few years ago. As technology continues to evolve, so too does the potential for reimagining this beloved tradition. Here's what the future might hold.</p>

      <h2>AI-Personalized Fortunes</h2>
      <p>Imagine a fortune cookie that knows you. With advances in AI and large language models, future fortune cookies could generate truly personalized messages based on your interests, goals, and current life situation. Rather than drawing from a fixed pool of generic wisdom, an AI-powered fortune engine might craft a unique message that references your recent accomplishments, offers encouragement for challenges you're facing, or provides specific inspiration related to your career change, creative project, or personal growth journey.</p>

      <p>The technology to do this already exists. Language models can generate coherent, thoughtful text in the style of fortune cookie wisdom, and user preference systems can learn what types of messages resonate most with individual users. The challenge lies in balancing personalization with the serendipity that makes fortune cookies magical — a fortune that's too precisely targeted might feel creepy rather than delightful.</p>

      <h2>Augmented Reality Cookies</h2>
      <p>AR technology could bring fortune cookies into the physical world in entirely new ways. Point your phone at a real fortune cookie and watch it digitally crack apart with dramatic particle effects and sound. Or see your fortune materialize as floating 3D text above the cookie — complete with golden sparkles and animated confetti. Apple's Vision Pro and similar spatial computing platforms could even let you break a virtual fortune cookie with your hands in mid-air, feeling haptic feedback as the cookie shatters.</p>

      <p>Restaurant chains could adopt AR fortune cookies as a way to enhance the dining experience. Scanning a physical cookie with the restaurant's app could unlock exclusive digital content, discount codes, or augmented reality mini-games that turn dessert into an interactive entertainment moment.</p>

      <h2>Social Fortune Experiences</h2>
      <p>Future digital fortune cookies might become multiplayer experiences. Break a cookie simultaneously with friends around the world and compare fortunes in real time. Fortune-based challenges, where friends compete to collect rare fortunes or complete themed fortune collections, could add a gamification layer to the experience. Imagine a weekly leaderboard showing which of your friends has the best luck streak, or collaborative fortune breaking events during holidays where a global community works together to unlock a legendary fortune.</p>

      <p>Social features could also include fortune gifting — sending a friend a special fortune cookie that they can break open, with a personal message hidden alongside the fortune. This blend of the personal and the serendipitous creates a new kind of digital greeting that's more playful and surprising than a standard message.</p>

      <h2>Fortune NFTs and Digital Collectibles</h2>
      <p>The concept of fortune rarity could extend into digital collectibles. Rare or legendary fortunes could become unique digital items that users can collect, trade, or display in their profiles. While the NFT market has cooled from its peak, the underlying concept of digital scarcity and collectibility remains compelling. A fortune that only one person in the world has received carries a different weight than one shared by thousands, and collection mechanics tap into the same psychological drives that make trading cards, stamp collecting, and achievement systems so enduringly popular.</p>

      <h2>Voice-Activated Fortunes</h2>
      <p>Smart speakers and voice assistants could offer fortune cookie experiences triggered by voice. "Hey Siri, break my fortune cookie" could trigger an immersive audio experience complete with cracking sounds and a dramatically read fortune. Morning routines might include a daily fortune alongside weather and news briefings, creating a small moment of whimsy in the start of each day. Voice-activated fortunes could also become a family ritual — kids love the surprise element, and hearing a fortune read aloud by a familiar voice assistant adds a theatrical quality that text on a screen can't match.</p>

      <h2>Therapeutic Fortune Cookies</h2>
      <p>There's growing interest in using positive affirmations and micro-interventions for mental health. Fortune cookies, with their tradition of positive messages, could evolve into therapeutic tools — delivering evidence-based positive psychology interventions disguised as playful fortune messages. Research has shown that brief exposure to positive statements can measurably improve mood and reduce anxiety. A fortune cookie that delivers a cognitive behavioral therapy reframing technique wrapped in the language of ancient wisdom could be both fun and genuinely helpful.</p>

      <p>Mental health apps could integrate fortune cookie mechanics as an engagement tool, making daily check-ins and affirmation exercises feel less clinical and more like a game. The element of surprise and delight that fortune cookies naturally provide is exactly what's missing from many wellness applications.</p>

      <h2>What We're Building</h2>
      <p>At Fortune Cookie, we're excited about the future. Our current experience with physics-based breaking and curated fortunes is just the beginning. We're exploring AI-generated fortunes, seasonal themes, and social features that will make each visit more engaging and personal. The fortune cookie tradition has survived and thrived for over a century by adapting to new cultures and technologies — and we intend to be part of its next chapter. Stay tuned — the best fortunes are yet to come.</p>
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
