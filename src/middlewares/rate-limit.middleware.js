import { createClient } from "redis";
import env from "../config/env.js";

const attemptsByKey = new Map();
let redisClient = null;

if (env.REDIS_URL) {
  redisClient = createClient({ url: env.REDIS_URL });
  redisClient.on("error", (err) => console.error("Redis rate limiter error:", err.message));
  redisClient.connect().catch(() => {});
}

function memoryHit(key, windowMs) {
  const now = Date.now();
  const record = attemptsByKey.get(key);
  if (!record || now > record.resetAt) {
    attemptsByKey.set(key, { count: 1, resetAt: now + windowMs });
    return { count: 1, ttlMs: windowMs };
  }
  record.count += 1;
  return { count: record.count, ttlMs: record.resetAt - now };
}

// Atomic fixed window: INCR, set expiry on first hit, return count and remaining TTL.
const SCRIPT = `
local c = redis.call('INCR', KEYS[1])
if c == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
return { c, redis.call('PTTL', KEYS[1]) }
`;

async function redisHit(key, windowMs) {
  const [count, ttl] = await redisClient.eval(SCRIPT, {
    keys: [`ratelimit:${key}`],
    arguments: [String(windowMs)],
  });
  return { count, ttlMs: ttl > 0 ? ttl : windowMs };
}

export function createRateLimiter({ windowMs, max, keyFn, message }) {
  return async function rateLimiter(req, res, next) {
    const key = typeof keyFn === "function" ? keyFn(req) : req.ip;
    let result;
    try {
      result = redisClient?.isReady ? await redisHit(key, windowMs) : memoryHit(key, windowMs);
    } catch {
      result = memoryHit(key, windowMs);
    }

    if (result.count > max) {
      res.set("Retry-After", String(Math.max(Math.ceil(result.ttlMs / 1000), 1)));
      return res.status(429).json({ error: { message } });
    }
    return next();
  };
}

export async function closeRateLimiter() {
  if (!redisClient) {
    return;
  }

  try {
    await redisClient.quit();
  } catch {
    redisClient.disconnect();
  }
}
