"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { ADSENSE_PUB_ID } from "@/lib/constants";

const AdsContext = createContext<{ suppress: () => void }>({ suppress: () => {} });

/** Leaf component: resets suppression on navigation without re-rendering the tree */
function AdsResetter({ onReset }: { onReset: () => void }) {
  const pathname = usePathname();
  useEffect(() => { onReset(); }, [pathname, onReset]);
  return null;
}

export function AdsProvider({ children }: { children: ReactNode }) {
  const [suppressed, setSuppressed] = useState(false);

  const suppress = useCallback(() => setSuppressed(true), []);
  const reset = useCallback(() => setSuppressed(false), []);
  const value = useMemo(() => ({ suppress }), [suppress]);

  return (
    <AdsContext.Provider value={value}>
      <AdsResetter onReset={reset} />
      {children}
      {!suppressed && (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
    </AdsContext.Provider>
  );
}

/** Drop this in any page to prevent AdSense from loading */
export function SuppressAds() {
  const { suppress } = useContext(AdsContext);
  useEffect(() => { suppress(); }, [suppress]);
  return null;
}
