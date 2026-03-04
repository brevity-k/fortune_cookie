"use client";

import { useState, useRef, useEffect } from "react";
import type { City } from "@/lib/astro/types";
import citiesData from "@/data/cities.json";

const cities = citiesData as City[];

interface Props {
  value: string;
  onSelect: (city: City) => void;
}

export default function CityAutocomplete({ value, onSelect }: Props) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [matches, setMatches] = useState<City[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleChange(q: string) {
    setQuery(q);
    if (q.length < 2) {
      setMatches([]);
      setOpen(false);
      return;
    }
    const lower = q.toLowerCase();
    const filtered = cities
      .filter((c) => c.name.toLowerCase().startsWith(lower))
      .slice(0, 8);
    setMatches(filtered);
    setOpen(filtered.length > 0);
  }

  function handleSelect(city: City) {
    setQuery(`${city.name}, ${city.country}`);
    setOpen(false);
    onSelect(city);
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Start typing a city name..."
        autoComplete="off"
        className="w-full rounded-lg border border-border bg-white/5 px-4 py-3 text-foreground placeholder:text-foreground/30 transition focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
      />
      {open && matches.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-background shadow-lg">
          {matches.map((city, i) => (
            <li key={`${city.name}-${city.country}-${i}`}>
              <button
                type="button"
                onClick={() => handleSelect(city)}
                className="w-full px-4 py-2.5 text-left text-sm text-foreground/70 transition hover:bg-gold/10 hover:text-foreground"
              >
                {city.name}, <span className="text-foreground/40">{city.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
