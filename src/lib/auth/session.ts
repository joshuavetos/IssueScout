import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { appUser, session } from "@/lib/db/schema";
import { keyedHash, randomOpaqueToken } from "@/lib/auth/crypto";

const COOKIE = "issue_scout_session";
const SESSION_DAYS = 14;

export async function createSession(appUserId: string): Promise<void> {
  const raw = randomOpaqueToken();
  const hash = keyedHash(raw);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await getDb().insert(session).values({ appUserId, sessionHash: hash, expiresAt });
  const jar = await cookies();
  jar.set(COOKIE, raw, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: expiresAt });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (raw) await getDb().delete(session).where(eq(session.sessionHash, keyedHash(raw)));
  jar.delete(COOKIE);
}

export async function getCurrentUser() {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const rows = await getDb()
    .select({ id: appUser.id, githubUserId: appUser.githubUserId, githubLogin: appUser.githubLogin, encryptedAccessToken: appUser.encryptedAccessToken })
    .from(session)
    .innerJoin(appUser, eq(session.appUserId, appUser.id))
    .where(and(eq(session.sessionHash, keyedHash(raw)), gt(session.expiresAt, new Date())))
    .limit(1);
  return rows[0] ?? null;
}
