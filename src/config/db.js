import pg from "pg";
import env from "./env.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: env.DATABASE_URL || undefined,
});

export async function query(text, params = []) {
  return pool.query(text, params);
}

export async function isDatabaseReady() {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

export async function closePool() {
  await pool.end();
}

export default pool;
