import horoscopeData from "@/data/horoscopes.json";

export interface ZodiacSign {
  key: string;
  name: string;
  symbol: string;
  element: string;
  dateRange: string;
}

export interface DailyHoroscope {
  text: string;
  love: number;
  career: number;
  health: number;
  luckyNumber: number;
  luckyColor: string;
  mood: string;
}

export interface WeeklyHoroscope {
  overview: string;
  love: string;
  career: string;
  advice: string;
}

export interface MonthlyHoroscope {
  overview: string;
  love: string;
  career: string;
  health: string;
  advice: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { key: "aries", name: "Aries", symbol: "\u2648", element: "Fire", dateRange: "Mar 21 - Apr 19" },
  { key: "taurus", name: "Taurus", symbol: "\u2649", element: "Earth", dateRange: "Apr 20 - May 20" },
  { key: "gemini", name: "Gemini", symbol: "\u264A", element: "Air", dateRange: "May 21 - Jun 20" },
  { key: "cancer", name: "Cancer", symbol: "\u264B", element: "Water", dateRange: "Jun 21 - Jul 22" },
  { key: "leo", name: "Leo", symbol: "\u264C", element: "Fire", dateRange: "Jul 23 - Aug 22" },
  { key: "virgo", name: "Virgo", symbol: "\u264D", element: "Earth", dateRange: "Aug 23 - Sep 22" },
  { key: "libra", name: "Libra", symbol: "\u264E", element: "Air", dateRange: "Sep 23 - Oct 22" },
  { key: "scorpio", name: "Scorpio", symbol: "\u264F", element: "Water", dateRange: "Oct 23 - Nov 21" },
  { key: "sagittarius", name: "Sagittarius", symbol: "\u2650", element: "Fire", dateRange: "Nov 22 - Dec 21" },
  { key: "capricorn", name: "Capricorn", symbol: "\u2651", element: "Earth", dateRange: "Dec 22 - Jan 19" },
  { key: "aquarius", name: "Aquarius", symbol: "\u2652", element: "Air", dateRange: "Jan 20 - Feb 18" },
  { key: "pisces", name: "Pisces", symbol: "\u2653", element: "Water", dateRange: "Feb 19 - Mar 20" },
];

const data = horoscopeData as {
  daily: { date: string; horoscopes: Record<string, DailyHoroscope> };
  weekly: { weekOf: string; horoscopes: Record<string, WeeklyHoroscope> };
  monthly: { month: string; horoscopes: Record<string, MonthlyHoroscope> };
};

export function getDailyHoroscope(sign: string): DailyHoroscope | null {
  return data.daily.horoscopes[sign] ?? null;
}

export function getWeeklyHoroscope(sign: string): WeeklyHoroscope | null {
  return data.weekly.horoscopes[sign] ?? null;
}

export function getMonthlyHoroscope(sign: string): MonthlyHoroscope | null {
  return data.monthly.horoscopes[sign] ?? null;
}

export function getDailyDate(): string {
  return data.daily.date;
}

export function getWeeklyDate(): string {
  return data.weekly.weekOf;
}

export function getMonthlyDate(): string {
  return data.monthly.month;
}

export function formatMonthYear(monthStr: string): string {
  const [year, month] = monthStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatWeekOf(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function formatDailyDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}
