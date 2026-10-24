import { verifyToken } from "../utils/jwt.js";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: { message: "Missing access token" } });
  }

  try {
    const payload = verifyToken(token);
    if (typeof payload.sub !== "string" || !UUID_PATTERN.test(payload.sub)) {
      return res.status(401).json({ error: { message: "Invalid or expired token" } });
    }
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: { message: "Invalid or expired token" } });
  }
}
