import Link from "next/link";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";
import type { LearnPageData } from "@/data/learn/types";

interface LearnPageProps {
  data: LearnPageData;
  slug: string;
  relatedLinks?: { title: string; href: string }[];
}

export default function LearnPage({ data, slug, relatedLinks }: LearnPageProps) {
  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Learn", url: `${SITE_URL}/learn` },
          { name: data.title, url: `${SITE_URL}/learn/${slug}` },
        ]}
      />
      {data.faqs.length > 0 && <FAQPageJsonLd faqs={data.faqs} />}

      <article className="mx-auto max-w-3xl">
        <Link
          href="/learn"
          className="mb-8 inline-flex items-center gap-1 text-sm text-foreground/40 transition hover:text-gold"
        >
          &larr; Back to Learn
        </Link>

        <header className="mb-8">
          <h1 className="text-golden-shimmer mb-3 text-3xl font-bold md:text-4xl">
            {data.title}
          </h1>
          {data.subtitle && (
            <p className="text-foreground/50 text-lg">{data.subtitle}</p>
          )}
        </header>

        <div className="space-y-8">
          {data.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl font-semibold text-gold mb-3">
                {section.heading}
              </h2>
              {section.paragraphs.map((p, j) => (
                <p key={j} className="leading-relaxed text-muted mb-3 last:mb-0">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        {data.faqs.length > 0 && (
          <section className="mt-10 rounded-2xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold text-gold mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {data.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="text-sm font-semibold text-foreground/70 mb-1">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-muted">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {relatedLinks && relatedLinks.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gold/60 hover:text-gold transition border border-border rounded-full px-3 py-1"
              >
                {link.title} &rarr;
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 border-t border-border pt-8">
          <Link href="/learn" className="text-gold transition hover:text-gold/80">
            &larr; Explore more guides
          </Link>
        </div>
      </article>
    </div>
  );
}
