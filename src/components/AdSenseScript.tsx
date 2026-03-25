"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

const ADSENSE_EXCLUDED_PATHS = ["/privacy", "/terms", "/contact", "/editorial-policy"];

export default function AdSenseScript() {
  const pathname = usePathname();

  if (ADSENSE_EXCLUDED_PATHS.includes(pathname)) {
    return null;
  }

  return (
    <Script
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7561681382580308"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
