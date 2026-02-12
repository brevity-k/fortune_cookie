import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Fortune Cookie - Break Your Virtual Fortune Cookie",
    template: "%s | Fortune Cookie",
  },
  description:
    "Break a virtual fortune cookie with realistic physics and discover your fortune! Interactive web experience with multiple breaking styles.",
  keywords: [
    "fortune cookie",
    "online fortune cookie",
    "virtual fortune cookie",
    "digital fortune cookie",
    "fortune cookie game",
    "break fortune cookie",
    "daily fortune",
    "fortune of the day",
  ],
  openGraph: {
    title: "Fortune Cookie - Break Your Virtual Fortune Cookie",
    description:
      "Break a virtual fortune cookie with realistic physics and discover your fortune!",
    url: "https://fortunecrack.com",
    siteName: "Fortune Cookie",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fortune Cookie - Break Your Virtual Fortune Cookie",
    description:
      "Break a virtual fortune cookie with realistic physics and discover your fortune!",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "ZCXdRe1by41X6aFMTv2K5oFBADl4A6pMV6D2qutFueY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/*
        Google AdSense - uncomment and replace with your publisher ID:
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-warm-gradient min-h-screen antialiased`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
