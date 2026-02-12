"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CONSENT_KEY = "cookie_consent";

type ConsentValue = "accepted" | "rejected";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage unavailable
    }
  }, []);

  function handleConsent(value: ConsentValue) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // localStorage unavailable
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="mx-auto max-w-4xl rounded-xl border border-gold/20 bg-[#2d1810]/95 px-6 py-4 shadow-[0_0_30px_rgba(212,160,74,0.15)] backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-foreground/80">
            We use cookies and similar technologies for analytics and advertising
            (Google Analytics, AdSense). By clicking &quot;Accept&quot;, you consent to
            their use. See our{" "}
            <Link href="/privacy" className="text-gold underline underline-offset-2 hover:text-gold-light">
              Privacy Policy
            </Link>{" "}
            for details.
          </p>
          <div className="flex shrink-0 gap-3">
            <button
              onClick={() => handleConsent("rejected")}
              className="rounded-lg border border-gold/20 px-4 py-2.5 text-sm text-foreground/60 transition hover:border-gold/40 hover:text-foreground/80"
            >
              Reject
            </button>
            <button
              onClick={() => handleConsent("accepted")}
              className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-gold-light"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
