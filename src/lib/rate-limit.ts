function createLimiter(prefix: string, maxRequests: number, windowMs: number) {
  const store = new Map<string, number[]>();

  return {
    async limit(key: string): Promise<{ success: boolean }> {
      const storeKey = `${prefix}:${key}`;
      const now = Date.now();

      if (store.size > 5000) {
        for (const [k, ts] of store) {
          if (ts.every((t) => now - t >= windowMs)) store.delete(k);
        }
        // Hard cap: evict oldest active entries if soft pruning was insufficient
        if (store.size > 5000) {
          const sorted = [...store.entries()].sort((a, b) => Math.max(...a[1]) - Math.max(...b[1]));
          for (let i = 0; i < sorted.length - 5000; i++) store.delete(sorted[i][0]);
        }
      }

      const timestamps = store.get(storeKey) ?? [];
      const recent = timestamps.filter((t) => now - t < windowMs);
      store.set(storeKey, recent);
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

/** Premium AI routes: 50 requests per day per customerId */
export const premiumAIRatelimit = createLimiter('premium-ai', 50, 24 * 60 * 60 * 1000);

/** Stripe subscribe routes: 10 requests per hour per IP */
export const subscribeRatelimit = createLimiter('subscribe', 10, 60 * 60 * 1000);
