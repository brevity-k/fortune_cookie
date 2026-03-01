import fortunesData from "@/data/fortunes.json";
import {
  JOURNAL_LIMIT,
  STREAK_RARE_THRESHOLD,
  STREAK_EPIC_THRESHOLD,
  STREAK_LEGENDARY_THRESHOLD,
} from "@/lib/constants";

export type FortuneCategory =
  | "wisdom"
  | "love"
  | "career"
  | "humor"
  | "motivation"
  | "philosophy"
  | "adventure"
  | "mystery";

export type Rarity = "common" | "rare" | "epic" | "legendary";

export interface Fortune {
  text: string;
  category: FortuneCategory;
  rarity: Rarity;
}

export interface CategoryData {
  rarity: Rarity;
  fortunes: string[];
}

export interface FortunesFile {
  categories: Record<string, CategoryData>;
}

const categories = fortunesData.categories as Record<string, CategoryData>;

export const CATEGORIES = Object.keys(categories) as FortuneCategory[];

export function getAllFortunes(): Fortune[] {
  const all: Fortune[] = [];
  for (const [cat, data] of Object.entries(categories)) {
    for (const text of data.fortunes) {
      all.push({ text, category: cat as FortuneCategory, rarity: data.rarity });
    }
  }
  return all;
}

export function getFortunesByCategory(category: FortuneCategory): Fortune[] {
  const data = categories[category];
  if (!data) return [];
  return data.fortunes.map((text) => ({
    text,
    category,
    rarity: data.rarity,
  }));
}

// Rarity weights (higher = more likely)
const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 60,
  rare: 25,
  epic: 10,
  legendary: 5,
};

// Seeded random number generator (mulberry32)
export function seededRandom(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function dateSeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

export function getDailyFortune(): Fortune {
  const seed = dateSeed();
  const rng = seededRandom(seed);

  // Daily fortune always from a special pool
  const allFortunes: Fortune[] = [];
  for (const [cat, data] of Object.entries(categories)) {
    for (const text of data.fortunes) {
      allFortunes.push({
        text,
        category: cat as FortuneCategory,
        rarity: data.rarity,
      });
    }
  }

  const index = Math.floor(rng() * allFortunes.length);
  return allFortunes[index];
}

export function getRandomFortune(streak: number = 0): Fortune {
  // Build weighted pool based on rarity
  const pool: { category: string; data: CategoryData; weight: number }[] = [];
  let totalWeight = 0;

  for (const [cat, data] of Object.entries(categories)) {
    let weight = RARITY_WEIGHTS[data.rarity] || 10;

    // Streak bonus: higher streaks unlock rarer categories more often
    if (streak >= STREAK_RARE_THRESHOLD && data.rarity === "rare") weight *= 1.5;
    if (streak >= STREAK_EPIC_THRESHOLD && data.rarity === "epic") weight *= 2;
    if (streak >= STREAK_LEGENDARY_THRESHOLD && data.rarity === "legendary") weight *= 3;

    pool.push({ category: cat, data, weight });
    totalWeight += weight;
  }

  // Select category
  let roll = Math.random() * totalWeight;
  let selectedCategory = pool[0];
  for (const entry of pool) {
    roll -= entry.weight;
    if (roll <= 0) {
      selectedCategory = entry;
      break;
    }
  }

  // Select fortune from category
  const fortunes = selectedCategory.data.fortunes;
  const index = Math.floor(Math.random() * fortunes.length);

  return {
    text: fortunes[index],
    category: selectedCategory.category as FortuneCategory,
    rarity: selectedCategory.data.rarity,
  };
}

export function getRarityColor(rarity: Rarity): string {
  switch (rarity) {
    case "common":
      return "#d4a04a";
    case "rare":
      return "#4a90d9";
    case "epic":
      return "#9b59b6";
    case "legendary":
      return "#e74c3c";
  }
}

export function getRarityLabel(rarity: Rarity): string {
  switch (rarity) {
    case "common":
      return "Common";
    case "rare":
      return "Rare";
    case "epic":
      return "Epic";
    case "legendary":
      return "Legendary";
  }
}

// Streak management (localStorage)
export function getStreak(): number {
  if (typeof window === "undefined") return 0;
  try {
    const data = JSON.parse(localStorage.getItem("fortune_streak") || "{}");
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (data.lastVisit === today) return data.count || 0;
    if (data.lastVisit === yesterday) return data.count || 0;
    return 0;
  } catch {
    return 0;
  }
}

export function updateStreak(): number {
  if (typeof window === "undefined") return 0;
  try {
    const data = JSON.parse(localStorage.getItem("fortune_streak") || "{}");
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    let count = 1;
    if (data.lastVisit === today) {
      return data.count || 1; // Already counted today
    } else if (data.lastVisit === yesterday) {
      count = (data.count || 0) + 1;
    }

    localStorage.setItem("fortune_streak", JSON.stringify({ lastVisit: today, count }));
    return count;
  } catch {
    return 1;
  }
}

/**
 * Generate a deterministic "fortune number" for display (like Wordle #847).
 * Based on days since launch + a hash of the fortune text.
 */
export function getFortuneNumber(text: string): number {
  const LAUNCH_DATE = new Date("2026-02-01");
  const now = new Date();
  const daysSinceLaunch = Math.floor((now.getTime() - LAUNCH_DATE.getTime()) / 86400000);
  // Simple hash of text to add variance
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return Math.abs(daysSinceLaunch * 1000 + (hash % 1000)) + 1;
}

/**
 * Get today's global fortune number (same for everyone).
 */
export function getDailyFortuneNumber(): number {
  const fortune = getDailyFortune();
  return getFortuneNumber(fortune.text);
}

// Fortune journal (localStorage)
export function saveToJournal(fortune: Fortune) {
  if (typeof window === "undefined") return;
  try {
    const journal = JSON.parse(localStorage.getItem("fortune_journal") || "[]");
    journal.unshift({
      ...fortune,
      date: new Date().toISOString(),
    });
    if (journal.length > JOURNAL_LIMIT) journal.length = JOURNAL_LIMIT;
    localStorage.setItem("fortune_journal", JSON.stringify(journal));
  } catch {
    // Silently fail
  }
}

export function getJournal(): (Fortune & { date: string })[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("fortune_journal") || "[]");
  } catch {
    return [];
  }
}
