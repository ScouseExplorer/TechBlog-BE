const attemptsByKey = new Map();

export function createRateLimiter({ windowMs, max, keyFn, message }) {
  return function rateLimiter(req, res, next) {
    const now = Date.now();
    const key = typeof keyFn === "function" ? keyFn(req) : req.ip;
    const record = attemptsByKey.get(key);

    if (!record || now > record.resetAt) {
      attemptsByKey.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);
      res.set("Retry-After", String(Math.max(retryAfterSec, 1)));
      return res.status(429).json({ error: { message } });
    }

    record.count += 1;
    return next();
  };
}
