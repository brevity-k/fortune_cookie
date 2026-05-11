const stores = new Map<string, Map<string, number[]>>();

function createLimiter(prefix: string, maxRequests: number, windowMs: number) {
  const store = new Map<string, number[]>();
  stores.set(prefix, store);

  return {
    async limit(key: string): Promise<{ success: boolean }> {
      const now = Date.now();
      const timestamps = store.get(key) ?? [];
      const recent = timestamps.filter((t) => now - t < windowMs);
      store.set(key, recent);
      if (recent.length >= maxRequests) return { success: false };
      recent.push(now);
      return { success: true };
    },
  };
}

/** Saju AI interpretation: 5 requests per day per IP */
export const sajuAIRatelimit = createLimiter('saju-ai', 5, 24 * 60 * 60 * 1000);

/** Astro AI interpretation: 5 requests per day per IP */
export const astroAIRatelimit = createLimiter('astro-ai', 5, 24 * 60 * 60 * 1000);

/** Contact form: 5 requests per hour per IP */
export const contactRatelimit = createLimiter('contact', 5, 60 * 60 * 1000);
