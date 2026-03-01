import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/90">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xl">🥠</span>
              <span className="text-golden-shimmer font-bold">Fortune Crack</span>
            </div>
            <p className="text-sm text-muted">
              Crack open a fortune cookie and discover your destiny. A new fortune awaits you every day.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground/80">Pages</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/about" className="text-muted transition hover:text-gold">About</Link>
              <Link href="/blog" className="text-muted transition hover:text-gold">Blog</Link>
              <Link href="/contact" className="text-muted transition hover:text-gold">Contact</Link>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground/80">Explore</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/lucky-numbers" className="text-muted transition hover:text-gold">Lucky Numbers</Link>
              <Link href="/horoscope" className="text-muted transition hover:text-gold">Daily Horoscopes</Link>
              <Link href="/fortune/wisdom" className="text-muted transition hover:text-gold">Fortune Categories</Link>
              <Link href="/zodiac/aries" className="text-muted transition hover:text-gold">Zodiac Signs</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground/80">Legal</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/privacy" className="text-muted transition hover:text-gold">Privacy Policy</Link>
              <Link href="/terms" className="text-muted transition hover:text-gold">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} Fortune Crack. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
