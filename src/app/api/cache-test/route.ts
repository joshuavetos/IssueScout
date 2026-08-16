import { NextResponse } from "next/server";
import { decryptSecret } from "@/lib/auth/crypto";
import { getCurrentUser } from "@/lib/auth/session";
import { githubRequest } from "@/lib/github/client";
import { isFresh, readCache, writeCache } from "@/lib/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEY = "spike:repo:future-agi/futureagi-sdk";
const TTL_MS = 10 * 60 * 1000;

type RepoSnapshot = { full_name: string; private: boolean; archived: boolean; default_branch: string };

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });

  const cached = await readCache<RepoSnapshot>(KEY);
  if (cached && isFresh(cached.expiresAt)) {
    return NextResponse.json({ ok: true, source: "cache", fetchedAt: cached.fetchedAt, repo: cached.value });
  }

  try {
    const token = decryptSecret(user.encryptedAccessToken);
    const { data } = await githubRequest<RepoSnapshot>(token, "/repos/future-agi/futureagi-sdk");
    const saved = await writeCache(KEY, { full_name: data.full_name, private: data.private, archived: data.archived, default_branch: data.default_branch }, TTL_MS);
    return NextResponse.json({ ok: true, source: "github", fetchedAt: saved.fetchedAt, repo: saved.value });
  } catch {
    if (cached) return NextResponse.json({ ok: true, source: "stale-cache", stale: true, fetchedAt: cached.fetchedAt, repo: cached.value });
    return NextResponse.json({ ok: false, code: "REFRESH_FAILED" }, { status: 503 });
  }
}
