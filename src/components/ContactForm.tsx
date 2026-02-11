"use client";

import { useState, type FormEvent } from "react";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to send. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-8 text-center">
        <div className="mb-3 text-3xl">&#10003;</div>
        <h2 className="mb-2 text-xl font-semibold text-green-400">Message Sent!</h2>
        <p className="text-foreground/60">
          Thanks for reaching out. Check your inbox for a confirmation email.
          We&apos;ll get back to you within 24-48 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-gold underline underline-offset-2 hover:text-gold-light"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputClasses =
    "w-full rounded-lg border border-gold/15 bg-white/5 px-4 py-3 text-foreground placeholder:text-foreground/30 transition focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gold/10 bg-gold/5 p-8">
      <h2 className="mb-6 text-xl font-semibold text-gold">Send a Message</h2>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gold/70">
              Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gold/70">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="mb-1 block text-sm font-medium text-gold/70">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="What is this about?"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium text-gold/70">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="Your message..."
            className={`${inputClasses} resize-y`}
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-red-400">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-lg bg-gold px-6 py-3 font-semibold text-background transition hover:bg-gold-light disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}
