export function requireRole(...roles) {
  return function roleGuard(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: { message: "Unauthorized" } });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: "Forbidden" } });
    }

    return next();
  };
}
