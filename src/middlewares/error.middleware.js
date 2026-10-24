export function notFoundHandler(req, res, next) {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const isProduction = process.env.NODE_ENV === "production";
  const message = status >= 500 && isProduction
    ? "Internal server error"
    : err.message || "Internal server error";

  if (status >= 500) {
    console.error("Unhandled application error:", err);
  }

  res.status(status).json({
    error: {
      message,
    },
  });
}
