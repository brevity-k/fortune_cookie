"use client";

import { useState, type FormEvent } from "react";
import { saveSajuProfile, type SajuProfile } from "@/lib/saju/profile";
import type { Gender } from "@/lib/saju/types";

const HOUR_LABELS = [
  "23:00 - 子시 (자시)", "01:00 - 丑시 (축시)", "03:00 - 寅시 (인시)",
  "05:00 - 卯시 (묘시)", "07:00 - 辰시 (진시)", "09:00 - 巳시 (사시)",
  "11:00 - 午시 (오시)", "13:00 - 未시 (미시)", "15:00 - 申시 (신시)",
  "17:00 - 酉시 (유시)", "19:00 - 戌시 (술시)", "21:00 - 亥시 (해시)",
];

const HOUR_VALUES = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

interface Props {
  onComplete: (profile: SajuProfile) => void;
}

export default function SajuOnboarding({ onComplete }: Props) {
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const year = parseInt((form.elements.namedItem("year") as HTMLInputElement).value);
    const month = parseInt((form.elements.namedItem("month") as HTMLSelectElement).value);
    const day = parseInt((form.elements.namedItem("day") as HTMLSelectElement).value);
    const hourStr = (form.elements.namedItem("hour") as HTMLSelectElement).value;
    const gender = (form.elements.namedItem("gender") as HTMLInputElement).value as Gender;

    if (!year || year < 1940 || year > 2050) {
      setError("Please enter a valid birth year (1940-2050).");
      return;
    }
    if (!month || !day) {
      setError("Please select your birth month and day.");
      return;
    }

    const hour = hourStr ? HOUR_VALUES[parseInt(hourStr)] : null;

    const profile = saveSajuProfile({ year, month, day, hour, gender });
    onComplete(profile);
  }

  const inputClasses =
    "w-full rounded-lg border border-border bg-white/5 px-4 py-3 text-foreground placeholder:text-foreground/30 transition focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-background p-6 sm:p-8">
      <h2 className="mb-2 text-xl font-semibold text-gold">
        Discover Your Four Pillars (사주)
      </h2>
      <p className="mb-6 text-sm text-foreground/50">
        Enter your birth details for a personalized fortune reading based on the Korean Four Pillars of Destiny.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="year" className="mb-1 block text-sm font-medium text-gold/70">
            Birth Year *
          </label>
          <input
            id="year"
            name="year"
            type="number"
            required
            min={1940}
            max={2050}
            placeholder="e.g. 1990"
            className={inputClasses}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="month" className="mb-1 block text-sm font-medium text-gold/70">
              Birth Month *
            </label>
            <select id="month" name="month" required className={inputClasses}>
              <option value="">Select month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="day" className="mb-1 block text-sm font-medium text-gold/70">
              Birth Day *
            </label>
            <select id="day" name="day" required className={inputClasses}>
              <option value="">Select day</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="hour" className="mb-1 block text-sm font-medium text-gold/70">
            Birth Hour (optional)
          </label>
          <select id="hour" name="hour" className={inputClasses}>
            <option value="">Unknown / Skip</option>
            {HOUR_LABELS.map((label, i) => (
              <option key={i} value={i}>{label}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-foreground/30">
            The hour pillar adds depth but is not required.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gold/70">
            Gender *
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-foreground/70 cursor-pointer">
              <input type="radio" name="gender" value="male" required className="accent-gold" />
              Male
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground/70 cursor-pointer">
              <input type="radio" name="gender" value="female" className="accent-gold" />
              Female
            </label>
          </div>
          <p className="mt-1 text-xs text-foreground/30">
            Used for calculating fortune cycle direction (양남음녀).
          </p>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-gold px-6 py-3 font-semibold text-background transition hover:bg-gold-light"
        >
          Reveal My Four Pillars
        </button>
      </div>
    </form>
  );
}
