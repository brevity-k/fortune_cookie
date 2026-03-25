"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const AdsContext = createContext<{ suppress: () => void }>({ suppress: () => {} });

export function AdsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [suppressed, setSuppressed] = useState(false);

  // Reset on navigation so ads re-enable for content pages
  useEffect(() => {
    setSuppressed(false);
  }, [pathname]);

  return (
    <AdsContext.Provider value={{ suppress: () => setSuppressed(true) }}>
      {children}
      {!suppressed && (
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7561681382580308"
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
