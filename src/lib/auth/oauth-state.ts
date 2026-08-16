import { eq, lt } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { oauthState } from "@/lib/db/schema";
import { keyedHash, randomOpaqueToken } from "@/lib/auth/crypto";

const TTL_MS = 10 * 60 * 1000;

export async function issueOauthState(): Promise<string> {
  const raw = randomOpaqueToken();
  await getDb().delete(oauthState).where(lt(oauthState.expiresAt, new Date()));
  await getDb().insert(oauthState).values({ stateHash: keyedHash(raw), expiresAt: new Date(Date.now() + TTL_MS) });
  return raw;
}

export async function consumeOauthState(raw: string): Promise<boolean> {
  const hash = keyedHash(raw);
  const rows = await getDb().select().from(oauthState).where(eq(oauthState.stateHash, hash)).limit(1);
  if (!rows[0] || rows[0].expiresAt <= new Date()) return false;
  await getDb().delete(oauthState).where(eq(oauthState.stateHash, hash));
  return true;
}
