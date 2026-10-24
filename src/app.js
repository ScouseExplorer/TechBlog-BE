import express from "express";
import logger from "morgan";
import helmet from "helmet";
import cors from "cors";
import env from "./config/env.js";
import apiRoutes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

const app = express();

app.disable("x-powered-by");
if (env.TRUST_PROXY !== undefined) {
  app.set("trust proxy", env.TRUST_PROXY);
}
app.use(helmet());

// Strict allowlist: requests without an Origin (curl, server-to-server) pass; other origins must be listed.
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.CORS_ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      const error = new Error("Origin not allowed by CORS");
      error.status = 403;
      return callback(error);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
  })
);

app.use(logger("dev"));
app.use(express.json({ limit: env.REQUEST_BODY_LIMIT }));
app.use(
  express.urlencoded({ extended: false, limit: env.REQUEST_BODY_LIMIT, parameterLimit: 100 })
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "TechBlog API" });
});

app.use("/api", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
