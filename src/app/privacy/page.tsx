import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Fortune Cookie — how we handle your data and cookies.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-golden-shimmer mb-6 text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
        <p className="mb-8 text-sm text-foreground/40">Last updated: February 2026</p>

        <div className="space-y-6 text-foreground/70 leading-relaxed">
          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">Introduction</h2>
            <p>
              Fortune Cookie (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
              committed to protecting your privacy. This Privacy Policy explains how we collect,
              use, and share information when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">Information We Collect</h2>
            <p>We collect minimal information to provide and improve our service:</p>
            <ul className="ml-6 mt-2 list-disc space-y-1">
              <li>
                <strong>Local Storage Data:</strong> Your fortune history, streak count, and
                preferences are stored locally in your browser. This data never leaves your device.
              </li>
              <li>
                <strong>Analytics Data:</strong> We use Google Analytics 4 to collect anonymous
                usage data such as page views, interaction events, and general geographic
                information. This helps us understand how our site is used and improve the
                experience.
              </li>
              <li>
                <strong>Cookies:</strong> We use cookies for analytics and advertising purposes.
                Third-party services like Google AdSense and Google Analytics may set their own
                cookies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">Google AdSense</h2>
            <p>
              We use Google AdSense to display advertisements. Google AdSense uses cookies to
              serve ads based on your prior visits to our website or other websites. You may opt
              out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline"
              >
                Google Ads Settings
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share anonymous, aggregated data
              with analytics providers to improve our service. Third-party advertising partners
              may collect information as described in their respective privacy policies.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">Your Rights</h2>
            <p>
              You can clear your local storage data at any time through your browser settings.
              You can opt out of Google Analytics by installing the{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">Children&apos;s Privacy</h2>
            <p>
              Our service is intended for general audiences and does not knowingly collect
              information from children under 13. If you believe we have inadvertently collected
              such information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any
              changes by posting the new policy on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-gold">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:brevity1s.wos@gmail.com" className="text-gold underline">
                brevity1s.wos@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
