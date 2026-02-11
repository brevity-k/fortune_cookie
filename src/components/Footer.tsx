import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-background/90">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xl">🥠</span>
              <span className="text-golden-shimmer font-bold">Fortune Cookie</span>
            </div>
            <p className="text-sm text-foreground/50">
              Break a virtual fortune cookie and discover your destiny. A new fortune awaits you every day.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gold">Pages</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/about" className="text-foreground/50 transition hover:text-gold">About</Link>
              <Link href="/blog" className="text-foreground/50 transition hover:text-gold">Blog</Link>
              <Link href="/contact" className="text-foreground/50 transition hover:text-gold">Contact</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gold">Legal</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/privacy" className="text-foreground/50 transition hover:text-gold">Privacy Policy</Link>
              <Link href="/terms" className="text-foreground/50 transition hover:text-gold">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gold/10 pt-6 text-center text-xs text-foreground/30">
          &copy; {new Date().getFullYear()} Fortune Cookie. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
