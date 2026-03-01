import { seededRandom, dateSeed, CATEGORIES } from "@/lib/fortuneEngine";

export default function TodayStats() {
  const seed = dateSeed();
  const rng = seededRandom(seed * 777);

  // Simulated daily stats (seeded so everyone sees the same numbers)
  const cookiesCracked = Math.floor(rng() * 15000) + 5000;
  const trendingCategory = CATEGORIES[Math.floor(rng() * CATEGORIES.length)];
  const rarities = ["Common", "Rare", "Epic", "Legendary"];
  const topRarity = rarities[Math.floor(rng() * 3)]; // Bias toward Common/Rare/Epic

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-2xl font-bold text-foreground/80">
            {cookiesCracked.toLocaleString()}
          </p>
          <p className="text-xs text-muted mt-1">cookies cracked today</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-2xl font-bold text-foreground/80 capitalize">
            {trendingCategory}
          </p>
          <p className="text-xs text-muted mt-1">trending category</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-2xl font-bold text-foreground/80">
            {topRarity}
          </p>
          <p className="text-xs text-muted mt-1">most common rarity</p>
        </div>
      </div>
    </section>
  );
}
