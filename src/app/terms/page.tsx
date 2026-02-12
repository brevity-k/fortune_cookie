import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${SITE_NAME}.`,
  openGraph: {
    title: `Terms of Service | ${SITE_NAME}`,
    description: `Terms of Service for ${SITE_NAME}.`,
    url: `${SITE_URL}/terms`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Terms of Service | ${SITE_NAME}`,
    description: `Terms of Service for ${SITE_NAME}.`,
  },
};

export default function TermsPage() {
  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-golden-shimmer mb-6 text-3xl sm:text-4xl font-bold">Terms of Service</h1>
        <p className="mb-8 text-sm text-foreground/40">Last updated: February 2026</p>

        <div className="space-y-6 text-foreground/70 leading-relaxed">
          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">Acceptance of Terms</h2>
            <p>
              By accessing and using Fortune Cookie, you agree to be bound by these Terms of
              Service. If you do not agree, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">Description of Service</h2>
            <p>
              Fortune Cookie is a free, interactive web application that allows users to
              virtually break fortune cookies and receive fortune messages. The service is
              provided for entertainment purposes only.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="ml-6 mt-2 list-disc space-y-1">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to interfere with or disrupt the service</li>
              <li>Use automated systems to access the service excessively</li>
              <li>Attempt to gain unauthorized access to our systems</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">Fortune Content</h2>
            <p>
              Fortune messages are provided for entertainment purposes only. They should not be
              relied upon for making important life decisions. We make no guarantees about the
              accuracy, applicability, or prophetic nature of any fortune message.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">Intellectual Property</h2>
            <p>
              All content on Fortune Cookie, including but not limited to text, graphics,
              animations, code, and fortune messages, is owned by or licensed to us and is
              protected by intellectual property laws. You may share individual fortune messages
              for personal, non-commercial purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">Advertisements</h2>
            <p>
              The service may display advertisements provided by third-party advertising
              networks, including Google AdSense. These advertisements are governed by their
              respective terms and privacy policies.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">Disclaimer of Warranties</h2>
            <p>
              The service is provided &quot;as is&quot; without warranties of any kind, either
              express or implied. We do not guarantee that the service will be uninterrupted,
              error-free, or free of harmful components.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, we shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the
              service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">Contact</h2>
            <p>
              For questions about these Terms, please contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
