import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { cacheEntry } from "@/lib/db/schema";

export async function readCache<T>(key: string): Promise<{ value: T; fetchedAt: Date; expiresAt: Date } | null> {
  const rows = await getDb().select().from(cacheEntry).where(eq(cacheEntry.key, key)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return { value: row.value as T, fetchedAt: row.fetchedAt, expiresAt: row.expiresAt };
}

export async function writeCache<T>(key: string, value: T, ttlMs: number, sourceRevision?: string) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlMs);
  await getDb().insert(cacheEntry).values({ key, value: value as object, fetchedAt: now, expiresAt, sourceRevision })
    .onConflictDoUpdate({ target: cacheEntry.key, set: { value: value as object, fetchedAt: now, expiresAt, sourceRevision } });
  return { value, fetchedAt: now, expiresAt };
}

export function isFresh(expiresAt: Date, now = new Date()): boolean {
  return expiresAt.getTime() > now.getTime();
}
