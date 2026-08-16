import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { consumeOauthState } from "@/lib/auth/oauth-state";
import { createSession } from "@/lib/auth/session";
import { encryptSecret } from "@/lib/auth/crypto";
import { getDb } from "@/lib/db";
import { appUser } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { exchangeOauthCode, githubRequest, type GithubUser } from "@/lib/github/client";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  if (!code || !state || !(await consumeOauthState(state))) return NextResponse.redirect(new URL("/?auth=invalid_state", request.url));

  try {
    const token = await exchangeOauthCode(code);
    const { data: profile } = await githubRequest<GithubUser>(token, "/user");
    if (String(profile.id) !== env.allowedGithubUserId()) return NextResponse.redirect(new URL("/?auth=denied", request.url));

    const encrypted = encryptSecret(token);
    const existing = await getDb().select({ id: appUser.id }).from(appUser).where(eq(appUser.githubUserId, String(profile.id))).limit(1);
    let userId = existing[0]?.id;
    if (userId) {
      await getDb().update(appUser).set({ githubLogin: profile.login, encryptedAccessToken: encrypted, updatedAt: new Date() }).where(eq(appUser.id, userId));
    } else {
      const inserted = await getDb().insert(appUser).values({ githubUserId: String(profile.id), githubLogin: profile.login, encryptedAccessToken: encrypted }).returning({ id: appUser.id });
      userId = inserted[0].id;
    }
    await createSession(userId);
    return NextResponse.redirect(new URL("/?auth=connected", request.url));
  } catch {
    return NextResponse.redirect(new URL("/?auth=failed", request.url));
  }
}
