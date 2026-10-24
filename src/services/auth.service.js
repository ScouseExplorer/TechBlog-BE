import bcrypt from "bcryptjs";
import env from "../config/env.js";

const SINGLE_USER = {
  id: 1,
  role: "admin",
};

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

  return { id: SINGLE_USER.id, email: expectedEmail, role: SINGLE_USER.role };
}
