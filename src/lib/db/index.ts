import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/lib/env";

const globalForDb = globalThis as unknown as { pool?: Pool };

export function getPool(): Pool {
  if (!globalForDb.pool) {
    globalForDb.pool = new Pool({ connectionString: env.databaseUrl(), max: 5 });
  }
  return globalForDb.pool;
}

export function getDb() {
  return drizzle(getPool());
}
