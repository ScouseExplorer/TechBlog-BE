import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, "../migrations");
const MIGRATION_LOCK_KEY = 883324102;

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getAppliedMigrationNames() {
  const result = await pool.query("SELECT name FROM schema_migrations");
  return new Set(result.rows.map((row) => row.name));
}

async function runMigrations() {
  await pool.query("SELECT pg_advisory_lock($1)", [MIGRATION_LOCK_KEY]);

  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  try {
    await ensureMigrationsTable();
    const appliedMigrationNames = await getAppliedMigrationNames();

    for (const file of files) {
      if (appliedMigrationNames.has(file)) {
        console.log(`Skipping migration (already applied): ${file}`);
        continue;
      }

      const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
      console.log(`Running migration: ${file}`);
      await pool.query("BEGIN");
      try {
        await pool.query(sql);
        await pool.query("INSERT INTO schema_migrations(name) VALUES ($1)", [file]);
        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }
    }

    console.log("Migrations completed successfully.");
  } finally {
    await pool.query("SELECT pg_advisory_unlock($1)", [MIGRATION_LOCK_KEY]);
  }
}

runMigrations()
  .catch((error) => {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
