export function notFoundHandler(req, res, next) {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    error: {
      message,
    },
  });
}
