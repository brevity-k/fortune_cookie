import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Content Policy",
  description:
    "How Fortune Crack creates, reviews, and publishes fortunes, horoscopes, and articles. Our standards for quality, accuracy, and transparency.",
  alternates: {
    canonical: `${SITE_URL}/editorial-policy`,
  },
  openGraph: {
    title: `Content Policy | ${SITE_NAME}`,
    description:
      "How Fortune Crack creates, reviews, and publishes fortunes, horoscopes, and articles. Our standards for quality, accuracy, and transparency.",
    url: `${SITE_URL}/editorial-policy`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Content Policy | ${SITE_NAME}`,
    description:
      "How Fortune Crack creates, reviews, and publishes fortunes, horoscopes, and articles. Our standards for quality, accuracy, and transparency.",
  },
};

export default function EditorialPolicyPage() {
  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <article className="mx-auto max-w-2xl">
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: SITE_URL },
            { name: "Content Policy", url: `${SITE_URL}/editorial-policy` },
          ]}
        />

        <h1 className="text-golden-shimmer mb-6 text-3xl sm:text-4xl font-bold">
          Content Policy
        </h1>
        <p className="mb-8 text-sm text-foreground/40">Last updated: March 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">What We Publish</h2>
            <p className="leading-relaxed text-muted mb-3">
              Fortune Crack publishes three types of content: fortune cookie messages, horoscope
              readings, and blog articles about fortune telling traditions, astrology, psychology,
              and cultural history. All content is created for entertainment and personal reflection.
              Nothing on this site should be taken as professional advice — financial, medical,
              psychological, or otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">Content Standards</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted">
              <li>
                <strong className="text-foreground/70">Originality:</strong> Our fortunes,
                horoscopes, and articles are original works. We do not copy or repackage content
                from other sources.
              </li>
              <li>
                <strong className="text-foreground/70">Accuracy:</strong> Factual claims in blog
                posts — whether about the history of fortune cookies, psychological research, or
                cultural practices — are checked before publication. If we make an error, we correct
                it promptly.
              </li>
              <li>
                <strong className="text-foreground/70">Inclusivity:</strong> Our content is written
                for a global audience. We respect diverse cultural perspectives on fortune, luck, and
                spirituality, and avoid stereotypes.
              </li>
              <li>
                <strong className="text-foreground/70">Freshness:</strong> Horoscopes are updated on
                a daily, weekly, and monthly schedule. Blog articles are published regularly. Stale
                or outdated content is flagged and refreshed automatically.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">
              Astrology &amp; Fortune Content
            </h2>
            <p className="leading-relaxed text-muted mb-3">
              Fortune Crack publishes horoscopes and fortune content rooted in traditional
              astrological frameworks. We approach astrology as a symbolic language for
              self-reflection — not as a predictive science. Our horoscope content draws on
              planetary transits, elemental associations, and sign characteristics rather than
              offering vague platitudes. Each daily horoscope is freshly written, so returning
              visitors always find new material.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">Corrections &amp; Feedback</h2>
            <p className="leading-relaxed text-muted mb-3">
              If you spot a factual error, a broken link, or content that does not meet the
              standards described on this page, we want to hear about it. You can reach us through
              our{" "}
              <a href="/contact" className="text-gold hover:underline">
                contact page
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gold mb-3">
              Advertising &amp; Independence
            </h2>
            <p className="leading-relaxed text-muted mb-3">
              Fortune Crack may display advertisements to support the cost of running this site.
              Advertising never influences content. We do not accept paid placements within
              fortunes, horoscopes, or articles. If you encounter an ad that feels misleading or
              inappropriate, please{" "}
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
