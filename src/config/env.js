import dotenv from "dotenv";

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3000),
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "change-me",
  ADMIN_EMAIL: (process.env.ADMIN_EMAIL || "admin@techblog.local").toLowerCase(),
  SINGLE_USER_EMAIL: (process.env.SINGLE_USER_EMAIL || process.env.ADMIN_EMAIL || "admin@techblog.local").toLowerCase(),
  SINGLE_USER_PASSWORD_HASH: process.env.SINGLE_USER_PASSWORD_HASH || "",
  AUTH_RATE_LIMIT_WINDOW_MS: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000),
  AUTH_RATE_LIMIT_MAX: Number(process.env.AUTH_RATE_LIMIT_MAX || 5),
};

export default env;
