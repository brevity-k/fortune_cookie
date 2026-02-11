import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Fortune Cookie team.",
};

export default function ContactPage() {
  return (
    <div className="bg-warm-gradient min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-golden-shimmer mb-6 text-4xl font-bold">Contact Us</h1>

        <div className="space-y-6 text-foreground/70 leading-relaxed">
          <p>
            We&apos;d love to hear from you! Whether you have feedback, questions, suggestions,
            or just want to share your favorite fortune, reach out to us.
          </p>

          <div className="rounded-2xl border border-gold/10 bg-gold/5 p-8">
            <h2 className="mb-4 text-xl font-semibold text-gold">Get in Touch</h2>

            <div className="space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-semibold text-gold/70">Email</h3>
                <a href="mailto:hello@fortunecrack.com" className="text-gold underline">
                  hello@fortunecrack.com
                </a>
              </div>

              <div>
                <h3 className="mb-1 text-sm font-semibold text-gold/70">Social Media</h3>
                <div className="flex gap-4">
                  <a
                    href="https://twitter.com/fortunecrack"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/50 transition hover:text-gold"
                  >
                    Twitter/X
                  </a>
                  <a
                    href="https://instagram.com/fortunecrack"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/50 transition hover:text-gold"
                  >
                    Instagram
                  </a>
                </div>
              </div>

              <div>
                <h3 className="mb-1 text-sm font-semibold text-gold/70">Bug Reports</h3>
                <p className="text-sm text-foreground/50">
                  Found a bug or have a technical issue? Please email us with a description of
                  the problem and we&apos;ll look into it.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gold/10 bg-gold/5 p-8">
            <h2 className="mb-4 text-xl font-semibold text-gold">Submit a Fortune</h2>
            <p className="text-foreground/50">
              Have a great fortune phrase idea? We&apos;re always looking to expand our collection
              of over 1,000 fortunes. Send your original fortune ideas to{" "}
              <a href="mailto:fortunes@fortunecrack.com" className="text-gold underline">
                fortunes@fortunecrack.com
              </a>{" "}
              and if we love it, we&apos;ll add it to the collection!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
