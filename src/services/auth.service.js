import bcrypt from "bcryptjs";
import env from "../config/env.js";
import { query } from "../config/db.js";

export async function loginUser({ email, password }) {
  const providedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const providedPassword = typeof password === "string" ? password : "";
  const expectedEmail = env.SINGLE_USER_EMAIL;
  const expectedHash = env.SINGLE_USER_PASSWORD_HASH;

  if (!expectedHash) {
    const error = new Error("Server authentication is not configured");
    error.status = 500;
    throw error;
  }

  if (providedEmail !== expectedEmail) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const ok = await bcrypt.compare(providedPassword, expectedHash);
  if (!ok) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const result = await query(
    "SELECT id, email, role FROM users WHERE email = $1 LIMIT 1",
    [expectedEmail]
  );
  const user = result.rows[0];

  if (!user) {
    const error = new Error(
      "Authenticated account is not present in the user database"
    );
    error.status = 500;
    throw error;
  }

  return user;
}
