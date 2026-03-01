import { Fortune, getRarityLabel, getFortuneNumber } from "@/lib/fortuneEngine";
import { CATEGORY_COLORS } from "@/lib/constants";

interface FortuneCardProps {
  fortune: Fortune;
  showNumber?: boolean;
}

function RarityStars({ rarity }: { rarity: string }) {
  const starCount =
    rarity === "common" ? 2 : rarity === "rare" ? 3 : rarity === "epic" ? 4 : 5;
  return (
    <span className="text-sm tracking-wide">
      {"★".repeat(starCount)}
      {"☆".repeat(5 - starCount)}
    </span>
  );
}

export default function FortuneCard({ fortune, showNumber = true }: FortuneCardProps) {
  const categoryColor = CATEGORY_COLORS[fortune.category] || "#d4a04a";
  const rarityLabel = getRarityLabel(fortune.rarity);
  const fortuneNumber = getFortuneNumber(fortune.text);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-8 sm:p-10 text-center"
      style={{
        background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 50%, ${categoryColor}bb 100%)`,
        color: "#fff",
      }}
    >
      <p
        className="text-xl sm:text-2xl leading-relaxed mb-6"
        style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
      >
        &ldquo;{fortune.text}&rdquo;
      </p>

      <div className="h-px w-24 mx-auto mb-4 bg-white/30" />

      <div className="flex items-center justify-center gap-3 mb-4">
        <span style={{ color: "rgba(255,255,255,0.9)" }}>
          <RarityStars rarity={fortune.rarity} />
        </span>
        <span className="text-sm text-white/70">
          {rarityLabel}
        </span>
        <span className="text-white/30">·</span>
        <span className="text-sm text-white/70 capitalize">
          {fortune.category}
        </span>
      </div>

      {showNumber && (
        <div className="text-xs text-white/50 tracking-wider">
          Fortune Crack #{fortuneNumber.toLocaleString()}
        </div>
      )}
    </div>
  );
}
