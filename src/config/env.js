import dotenv from "dotenv";

dotenv.config();

function parseInteger(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function parseTrustProxy(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  const hops = Number.parseInt(String(value), 10);
  if (!Number.isNaN(hops)) {
    return hops;
  }

  return value;
}

function validateEnv(config) {
  if (!Number.isInteger(config.PORT) || config.PORT < 1 || config.PORT > 65535) {
    throw new Error("Invalid PORT. Expected an integer between 1 and 65535.");
  }

  if (!Number.isInteger(config.AUTH_RATE_LIMIT_WINDOW_MS) || config.AUTH_RATE_LIMIT_WINDOW_MS < 1000) {
    throw new Error("Invalid AUTH_RATE_LIMIT_WINDOW_MS. Expected an integer >= 1000.");
  }

  if (!Number.isInteger(config.AUTH_RATE_LIMIT_MAX) || config.AUTH_RATE_LIMIT_MAX < 1) {
    throw new Error("Invalid AUTH_RATE_LIMIT_MAX. Expected an integer >= 1.");
  }

  if (config.NODE_ENV === "production") {
    if (!config.DATABASE_URL) {
      throw new Error("DATABASE_URL is required in production.");
    }

    if (!config.JWT_SECRET || config.JWT_SECRET === "change-me" || config.JWT_SECRET.length < 32) {
      throw new Error("JWT_SECRET must be set to a strong value in production (min length: 32).");
    }

    if (!config.SINGLE_USER_PASSWORD_HASH) {
      throw new Error("SINGLE_USER_PASSWORD_HASH is required in production.");
    }

    if (config.CORS_ALLOWED_ORIGINS.length === 0) {
      throw new Error("CORS_ALLOWED_ORIGINS must include at least one origin in production.");
    }
  }
}

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInteger(process.env.PORT || 3000, 3000),
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "change-me",
  ADMIN_EMAIL: (process.env.ADMIN_EMAIL || "admin@techblog.local").toLowerCase(),
  SINGLE_USER_EMAIL: (process.env.SINGLE_USER_EMAIL || process.env.ADMIN_EMAIL || "admin@techblog.local").toLowerCase(),
  SINGLE_USER_PASSWORD_HASH: process.env.SINGLE_USER_PASSWORD_HASH || "",
  REDIS_URL: process.env.REDIS_URL || "",
  AUTH_RATE_LIMIT_WINDOW_MS: parseInteger(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000, 10 * 60 * 1000),
  AUTH_RATE_LIMIT_MAX: parseInteger(process.env.AUTH_RATE_LIMIT_MAX || 5, 5),
  CORS_ALLOWED_ORIGINS: (process.env.CORS_ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  REQUEST_BODY_LIMIT: process.env.REQUEST_BODY_LIMIT || "100kb",
  TRUST_PROXY: parseTrustProxy(process.env.TRUST_PROXY),
};

validateEnv(env);

export default env;
