export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fortune Cookie",
    url: "https://fortunecrack.com",
    logo: "https://fortunecrack.com/opengraph-image",
    description:
      "Break a virtual fortune cookie with realistic physics and discover your fortune!",
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Fortune Cookie",
    url: "https://fortunecrack.com",
    description:
      "Break a virtual fortune cookie with realistic physics and discover your fortune! Interactive web experience with multiple breaking styles.",
    publisher: {
      "@type": "Organization",
      name: "Fortune Cookie",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
}

export function ArticleJsonLd({ title, description, slug, datePublished }: ArticleJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `https://fortunecrack.com/blog/${slug}`,
    datePublished,
    dateModified: datePublished,
    author: {
      "@type": "Organization",
      name: "Fortune Cookie",
    },
    publisher: {
      "@type": "Organization",
      name: "Fortune Cookie",
      logo: {
        "@type": "ImageObject",
        url: "https://fortunecrack.com/opengraph-image",
      },
    },
    image: `https://fortunecrack.com/blog/${slug}/opengraph-image`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://fortunecrack.com/blog/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
