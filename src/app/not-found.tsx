import Link from "next/link";
import { SuppressAds } from "@/components/AdsContext";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <SuppressAds />
      <div className="text-6xl mb-4">🥠</div>
      <h1 className="text-golden-shimmer text-3xl font-bold mb-2">Page Not Found</h1>
      <p className="text-muted mb-6">This fortune cookie crumbled into a 404.</p>
      <Link
        href="/"
        className="rounded-full bg-gold px-6 py-2.5 font-semibold text-background transition hover:bg-gold-light"
      >
        Break a New Cookie
      </Link>
    </div>
  );
}
