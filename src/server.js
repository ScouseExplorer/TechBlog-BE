import http from "http";
import app from "./app.js";
import env from "./config/env.js";
import { closePool } from "./config/db.js";
import { closeRateLimiter } from "./middlewares/rate-limit.middleware.js";

const server = http.createServer(app);
let shuttingDown = false;

server.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});

server.on("error", (error) => {
  console.error("HTTP server error:", error);
  process.exitCode = 1;
});

async function shutdown(signal) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  console.log(`Received ${signal}. Shutting down gracefully...`);

  const forceExitTimer = setTimeout(() => {
    console.error("Graceful shutdown timed out. Exiting now.");
    process.exit(1);
  }, 10_000);
  forceExitTimer.unref();

  server.close(async () => {
    await Promise.allSettled([closePool(), closeRateLimiter()]);
    process.exit(0);
  });
}

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});
