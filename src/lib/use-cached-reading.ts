"use client";

import { useEffect, useMemo, useState } from "react";

interface CachedReadingOptions<C, T> {
  chart: C;
  endpoint: string;
  errorMessage: string;
  readCache: (chart: C) => T | null;
  writeCache: (chart: C, data: T) => void;
  /** Extracts the reading from the JSON response. Must be stable (module-level). */
  select?: (json: unknown) => T;
}

interface FetchResult<C, T> {
  chart: C;
  data: T | null;
  error: string;
}

/**
 * Loads a premium reading for `chart`, preferring the localStorage cache and
 * falling back to a POST to `endpoint`. State is only set from async fetch
 * callbacks; loading/data/error for the current chart are derived in render.
 */
export function useCachedReading<C, T>({
  chart,
  endpoint,
  errorMessage,
  readCache,
  writeCache,
  select,
}: CachedReadingOptions<C, T>) {
  const cached = useMemo(() => readCache(chart), [chart, readCache]);
  const [result, setResult] = useState<FetchResult<C, T> | null>(null);

  useEffect(() => {
    if (cached) return;
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ chart }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || errorMessage);
        }
        const json: unknown = await res.json();
        const data = select ? select(json) : (json as T);
        writeCache(chart, data);
        if (!cancelled) setResult({ chart, data, error: "" });
      } catch (err) {
        if (!cancelled) {
          setResult({
            chart,
            data: null,
            error: err instanceof Error ? err.message : "Something went wrong.",
          });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [chart, cached, endpoint, errorMessage, writeCache, select]);

  const current = result?.chart === chart ? result : null;
  return {
    data: cached ?? current?.data ?? null,
    loading: !cached && !current,
    error: current?.error ?? "",
  };
}
