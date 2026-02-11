"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-gold/20 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🥠</span>
          <span className="text-golden-shimmer text-xl font-bold tracking-wide">
            Fortune Cookie
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/" className="text-foreground/70 transition hover:text-gold">
            Home
          </Link>
          <Link href="/blog" className="text-foreground/70 transition hover:text-gold">
            Blog
          </Link>
          <Link href="/about" className="text-foreground/70 transition hover:text-gold">
            About
          </Link>
          <Link href="/contact" className="text-foreground/70 transition hover:text-gold">
            Contact
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-foreground/70 md:hidden"
          aria-label="Toggle menu"
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
        <nav className="border-t border-gold/10 bg-background/95 px-4 py-3 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/" onClick={() => setMenuOpen(false)} className="text-foreground/70 transition hover:text-gold">
              Home
            </Link>
            <Link href="/blog" onClick={() => setMenuOpen(false)} className="text-foreground/70 transition hover:text-gold">
              Blog
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="text-foreground/70 transition hover:text-gold">
              About
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-foreground/70 transition hover:text-gold">
              Contact
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
