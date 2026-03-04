"use client";

import { useState, type FormEvent } from "react";
import { saveAstroProfile } from "@/lib/astro/profile";
import type { AstroProfile, City } from "@/lib/astro/types";
import CityAutocomplete from "./CityAutocomplete";

interface Props {
  onComplete: (profile: AstroProfile) => void;
}

export default function AstroOnboarding({ onComplete }: Props) {
  const [error, setError] = useState("");
  const [city, setCity] = useState<City | null>(null);
  const [cityDisplay, setCityDisplay] = useState("");

  function handleCitySelect(c: City) {
    setCity(c);
    setCityDisplay(`${c.name}, ${c.country}`);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const dateStr = (form.elements.namedItem("birthdate") as HTMLInputElement).value;
    const timeStr = (form.elements.namedItem("birthtime") as HTMLInputElement).value;

    if (!dateStr) {
      setError("Please enter your birth date.");
      return;
    }
    if (!timeStr) {
      setError("Please enter your birth time.");
      return;
    }
    if (!city) {
      setError("Please select a birth city from the suggestions.");
      return;
    }

    const [yearStr, monthStr, dayStr] = dateStr.split("-");
    const [hourStr, minuteStr] = timeStr.split(":");

    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    if (year < 1900 || year > 2100) {
      setError("Please enter a valid birth year (1900-2100).");
      return;
    }

    try {
      const profile = saveAstroProfile({
        year,
        month,
        day,
        hour,
        minute,
        latitude: city.lat,
        longitude: city.lng,
        cityName: city.name,
      });
      onComplete(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to calculate chart. Please check your inputs.");
    }
  }

  const inputClasses =
    "w-full rounded-lg border border-border bg-white/5 px-4 py-3 text-foreground placeholder:text-foreground/30 transition focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-background p-6 sm:p-8">
      <h2 className="mb-2 text-xl font-semibold text-gold">
        Calculate Your Natal Chart
      </h2>
      <p className="mb-6 text-sm text-foreground/50">
        Enter your exact birth details to generate a personalized natal chart with planetary positions, houses, and aspects.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="birthdate" className="mb-1 block text-sm font-medium text-gold/70">
            Birth Date *
          </label>
          <input
            id="birthdate"
            name="birthdate"
            type="date"
            required
            min="1900-01-01"
            max="2100-12-31"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="birthtime" className="mb-1 block text-sm font-medium text-gold/70">
            Birth Time *
          </label>
          <input
            id="birthtime"
            name="birthtime"
            type="time"
            required
            className={inputClasses}
          />
          <p className="mt-1 text-xs text-foreground/30">
            Exact birth time is needed for accurate house cusps and ascendant.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gold/70">
            Birth City *
          </label>
          <CityAutocomplete value={cityDisplay} onSelect={handleCitySelect} />
          <p className="mt-1 text-xs text-foreground/30">
            Type at least 2 characters and select from the dropdown.
          </p>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-gold px-6 py-3 font-semibold text-background transition hover:bg-gold-light"
        >
          Calculate My Natal Chart
        </button>
      </div>
    </form>
  );
}
