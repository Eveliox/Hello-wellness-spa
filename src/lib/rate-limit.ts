import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type WindowDuration = `${number} ${"s" | "m" | "h" | "d"}`;

function makeLimiter(limit: number, window: WindowDuration, prefix: string): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix,
    analytics: true,
  });
}

// Per-route limits. Tuned for human-realistic usage:
// no legitimate person submits an intake 3 times in an hour.
const limiters = {
  contact: makeLimiter(5, "1 h", "rl:contact"),
  newsletter: makeLimiter(3, "1 h", "rl:newsletter"),
  intake: makeLimiter(3, "1 h", "rl:intake"),
  glp1Intake: makeLimiter(3, "1 h", "rl:glp1intake"),
  checkout: makeLimiter(10, "1 h", "rl:checkout"),
} as const;

export type RateLimitBucket = keyof typeof limiters;

export type RateLimitResult = {
  allowed: boolean;
  /** Unix ms when the limit resets — only present when allowed is false. */
  reset?: number;
};

export async function checkRateLimit(
  request: Request,
  bucket: RateLimitBucket,
): Promise<RateLimitResult> {
  const limiter = limiters[bucket];
  if (!limiter) {
    if (!warnedMissing) {
      console.warn("[rate-limit] Upstash not configured — rate limiting disabled");
      warnedMissing = true;
    }
    return { allowed: true };
  }

  const ip = getClientIp(request);
  const { success, reset } = await limiter.limit(ip);
  return { allowed: success, reset };
}

let warnedMissing = false;

function getClientIp(request: Request): string {
  // Vercel sets x-forwarded-for; first IP is the real client.
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "anonymous";
}

export function rateLimitResponse(result: RateLimitResult): Response {
  const retryAfterSec = result.reset
    ? Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))
    : 60;
  return Response.json(
    { ok: false, message: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    },
  );
}
