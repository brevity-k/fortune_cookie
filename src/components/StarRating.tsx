/**
 * Reusable star rating display component.
 * Used in horoscope hub and daily horoscope pages.
 */
export function StarRating({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-foreground/40 w-16">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`text-lg ${i <= rating ? "text-gold" : "text-foreground/10"}`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-xs text-foreground/30">{rating}/5</span>
    </div>
  );
}

/**
 * Compact variant used in grid cards (horoscope hub).
 */
export function StarRatingCompact({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-foreground/40 w-14">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={i <= rating ? "text-gold" : "text-foreground/10"}>
            ★
          </span>
        ))}
      </div>
    </div>
  );
}
