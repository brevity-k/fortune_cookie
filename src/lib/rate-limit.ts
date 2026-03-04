import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

function createLimiter(prefix: string, requests: number, window: string): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(requests, window as Parameters<typeof Ratelimit.slidingWindow>[1]),
    prefix: `fortunecrack:${prefix}`,
    ephemeralCache: new Map(),
  });
}

/** Saju AI interpretation: 5 requests per day per IP */
export const sajuAIRatelimit = createLimiter('saju-ai', 5, '1 d');

/** Astro AI interpretation: 5 requests per day per IP */
export const astroAIRatelimit = createLimiter('astro-ai', 5, '1 d');

/** Contact form: 5 requests per hour per IP */
export const contactRatelimit = createLimiter('contact', 5, '1 h');
