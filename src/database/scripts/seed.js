import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedersDir = path.resolve(__dirname, "../seeders");

async function runSeeders() {
  const files = (await fs.readdir(seedersDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  await pool.query("BEGIN");

  try {
    for (const file of files) {
      const sql = await fs.readFile(path.join(seedersDir, file), "utf8");
      console.log(`Running seeder: ${file}`);
      await pool.query(sql);
    }

    await pool.query("COMMIT");
    console.log("Seeding completed successfully.");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

runSeeders()
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
