import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description:
    "Our editorial standards, content guidelines, and commitment to transparency. Learn how the Fortune Crack Editorial Team creates, reviews, and publishes content.",
  alternates: {
    canonical: `${SITE_URL}/editorial-policy`,
  },
  openGraph: {
    title: `Editorial Policy | ${SITE_NAME}`,
    description:
      "Our editorial standards, content guidelines, and commitment to transparency. Learn how the Fortune Crack Editorial Team creates, reviews, and publishes content.",
    url: `${SITE_URL}/editorial-policy`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Editorial Policy | ${SITE_NAME}`,
    description:
      "Our editorial standards, content guidelines, and commitment to transparency. Learn how the Fortune Crack Editorial Team creates, reviews, and publishes content.",
  },
};

export default function EditorialPolicyPage() {
  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <article className="mx-auto max-w-2xl">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: SITE_URL },
            { name: "Editorial Policy", url: `${SITE_URL}/editorial-policy` },
          ]}
        />

        <h1 className="text-golden-shimmer mb-6 text-3xl sm:text-4xl font-bold">
          Editorial Policy
        </h1>
        <p className="mb-8 text-sm text-foreground/40">Last updated: March 2026</p>

        <div className="space-y-8">
          {/* Our Mission */}
          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">Our Mission</h2>
            <p className="leading-relaxed text-muted mb-3">
              The Fortune Crack Editorial Team exists to create moments of genuine delight and
              reflection. We believe that a fortune cookie — even a virtual one — carries real power
              when it arrives at the right moment with the right words. Our mission is to deliver
              original, thoughtful content that entertains, inspires, and occasionally surprises our
              readers into seeing their day a little differently.
            </p>
            <p className="leading-relaxed text-muted mb-3">
              We are not a generic quote aggregator. Every fortune in our database is crafted or
              curated with intention, and every article on our blog is written to provide actual
              value — whether that means exploring the cultural history of fortune cookies, offering
              practical wellness advice, or diving into the rich traditions of astrology and
              divination. We hold ourselves to the standard that every piece of content should be
              worth the reader&apos;s time.
            </p>
          </section>

          {/* Content Standards */}
          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">Content Standards</h2>
            <p className="leading-relaxed text-muted mb-3">
              All content published on Fortune Crack goes through an editorial review process
              designed to maintain quality, accuracy, and originality. The Fortune Crack Editorial
              Team adheres to the following standards across every piece of content we publish:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted">
              <li>
                <strong className="text-foreground/70">Originality:</strong> We do not copy or
                repackage content from other sources. Our fortunes, blog articles, and horoscope
                interpretations are original works. When referencing external research or cultural
                traditions, we provide proper context and attribution.
              </li>
              <li>
                <strong className="text-foreground/70">Accuracy:</strong> Factual claims in our blog
                posts — whether about the history of fortune cookies, psychological research on luck,
                or cultural practices — are researched and verified before publication. If we make an
                error, we correct it promptly.
              </li>
              <li>
                <strong className="text-foreground/70">Inclusivity:</strong> Our content is written
                for a global audience. We respect diverse cultural perspectives on fortune, luck, and
                spirituality. We avoid stereotypes and present traditions with the nuance they deserve.
              </li>
              <li>
                <strong className="text-foreground/70">Clarity:</strong> We write in plain,
                accessible language. Articles are structured with clear headings, concise paragraphs,
                and a logical flow so that readers can quickly find what they are looking for.
              </li>
              <li>
                <strong className="text-foreground/70">Regular review:</strong> Published content is
                periodically reviewed for accuracy and relevance. Outdated articles are updated or
                retired. Our automated content health checks flag stale content so nothing is
                forgotten.
              </li>
            </ul>
          </section>

          {/* Astrology & Fortune Content */}
          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">
              Astrology &amp; Fortune Content
            </h2>
            <p className="leading-relaxed text-muted mb-3">
              Fortune Crack publishes daily horoscopes, zodiac profiles, and fortune content rooted
              in traditional astrological frameworks. We want to be transparent about how we approach
              this material: our horoscopes and fortunes are created for entertainment, personal
              reflection, and cultural exploration. They are not presented as scientific predictions
              or professional advice.
            </p>
            <p className="leading-relaxed text-muted mb-3">
              That said, we take the craft seriously. Our horoscope content draws on established
              astrological traditions — planetary transits, elemental associations, and sign
              characteristics — rather than offering vague platitudes that could apply to anyone. We
              aim for specificity and thoughtfulness, because we believe readers deserve content that
              feels intentional even within the realm of entertainment. Each daily horoscope is
              freshly generated rather than recycled, so returning visitors always find new material.
            </p>
          </section>

          {/* AI Transparency */}
          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">AI Transparency</h2>
            <p className="leading-relaxed text-muted mb-3">
              We use artificial intelligence as a tool in our content creation pipeline, and we
              believe in being upfront about it. AI assists us in generating draft fortunes,
              horoscope interpretations, and blog article outlines. However, AI output is never
              published without human editorial oversight. Every piece of content goes through our
              quality review process, which includes structural validation, factual checking, and a
              minimum quality threshold before publication.
            </p>
            <p className="leading-relaxed text-muted mb-3">
              We view AI as a collaborator that helps us maintain a consistent publishing schedule
              and explore creative angles we might not reach on our own. The editorial judgment —
              what to publish, how to frame it, and whether it meets our standards — always rests
              with the Fortune Crack Editorial Team. We continuously refine our AI workflows to
              improve content quality and will update this policy as our processes evolve.
            </p>
          </section>

          {/* Corrections & Feedback */}
          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">Corrections &amp; Feedback</h2>
            <p className="leading-relaxed text-muted mb-3">
              We are committed to getting things right, and we welcome feedback from our readers. If
              you spot a factual error, a broken link, outdated information, or content that does not
              meet the standards described on this page, we want to hear about it. Corrections are
              made promptly and transparently — significant changes to published content will be
              noted with an updated date.
            </p>
            <p className="leading-relaxed text-muted mb-3">
              You can reach the Fortune Crack Editorial Team through our{" "}
              <a href="/contact" className="text-gold hover:underline">
                contact page
              </a>
              . We read every message and aim to respond within 48 hours.
            </p>
          </section>

          {/* Advertising & Independence */}
          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">
              Advertising &amp; Independence
            </h2>
            <p className="leading-relaxed text-muted mb-3">
              Fortune Crack may display advertisements to support the cost of running this site and
              keeping all content free for our readers. Advertising never influences our editorial
              decisions. We do not accept paid placements within our fortunes, horoscopes, or blog
              articles. Our content recommendations are based solely on what we believe is valuable
              and relevant to our audience.
            </p>
            <p className="leading-relaxed text-muted mb-3">
              We are selective about the advertising partners we work with and strive to ensure that
              ads displayed on Fortune Crack are appropriate for our general audience. If you
              encounter an ad that feels misleading or inappropriate, please{" "}
              <a href="/contact" className="text-gold hover:underline">
                let us know
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
