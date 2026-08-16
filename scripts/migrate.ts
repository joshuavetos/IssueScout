import { migrate } from "drizzle-orm/node-postgres/migrator";
import { getDb, getPool } from "../src/lib/db/index";

async function main() {
  try {
    await migrate(getDb(), { migrationsFolder: "./drizzle" });
    console.log("MIGRATIONS_OK");
  } finally {
    await getPool().end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
