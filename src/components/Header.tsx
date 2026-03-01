"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🥠</span>
          <span className="text-golden-shimmer text-xl font-bold tracking-wide">
            Fortune Crack
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/" className="text-foreground/60 transition hover:text-gold">
            Home
          </Link>
          <Link href="/daily" className="text-foreground/60 transition hover:text-gold">
            Daily
          </Link>
          <Link href="/blog" className="text-foreground/60 transition hover:text-gold">
            Blog
          </Link>
          <Link href="/about" className="text-foreground/60 transition hover:text-gold">
            About
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 -mr-2 text-foreground/60 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1 text-sm">
            <Link href="/" onClick={() => setMenuOpen(false)} className="py-2 text-foreground/60 transition hover:text-gold">
              Home
            </Link>
            <Link href="/daily" onClick={() => setMenuOpen(false)} className="py-2 text-foreground/60 transition hover:text-gold">
              Daily
            </Link>
            <Link href="/blog" onClick={() => setMenuOpen(false)} className="py-2 text-foreground/60 transition hover:text-gold">
              Blog
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="py-2 text-foreground/60 transition hover:text-gold">
              About
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
