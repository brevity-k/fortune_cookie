import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { SITE_URL, SITE_NAME, CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${SITE_NAME} team.`,
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: `Contact Us | ${SITE_NAME}`,
    description: `Get in touch with the ${SITE_NAME} team.`,
    url: `${SITE_URL}/contact`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact Us | ${SITE_NAME}`,
    description: `Get in touch with the ${SITE_NAME} team.`,
  },
};

export default function ContactPage() {
  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-golden-shimmer mb-6 text-3xl sm:text-4xl font-bold">Contact Us</h1>

        <div className="space-y-6 text-foreground/70 leading-relaxed">
          <p>
            We&apos;d love to hear from you! Whether you have feedback, questions, suggestions,
            or just want to share your favorite fortune, reach out to us.
          </p>

          <ContactForm />

          <div className="rounded-2xl border border-border bg-background p-8">
            <h2 className="mb-4 text-xl font-semibold text-gold">Other Ways to Reach Us</h2>

            <div className="space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-semibold text-gold/70">Email</h3>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold underline">
                  {CONTACT_EMAIL}
                </a>
              </div>

              <div>
                <h3 className="mb-1 text-sm font-semibold text-gold/70">Bug Reports</h3>
                <p className="text-sm text-foreground/50">
                  Found a bug or have a technical issue? Use the form above or email us with a
                  description of the problem and we&apos;ll look into it.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background p-8">
            <h2 className="mb-4 text-xl font-semibold text-gold">Submit a Fortune</h2>
            <p className="text-foreground/50">
              Have a great fortune phrase idea? We&apos;re always looking to expand our collection
              of over 1,000 fortunes. Send your original fortune ideas to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold underline">
                {CONTACT_EMAIL}
              </a>{" "}
              and if we love it, we&apos;ll add it to the collection!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
