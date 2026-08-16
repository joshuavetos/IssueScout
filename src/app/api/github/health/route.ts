import { NextResponse } from "next/server";
import { decryptSecret } from "@/lib/auth/crypto";
import { getCurrentUser } from "@/lib/auth/session";
import { GithubApiError, githubRequest, type GithubUser } from "@/lib/github/client";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });

  try {
    const token = decryptSecret(user.encryptedAccessToken);
    const { data: profile, headers } = await githubRequest<GithubUser>(token, "/user");
    if (String(profile.id) !== env.allowedGithubUserId()) return NextResponse.json({ ok: false, code: "WRONG_ACCOUNT" }, { status: 403 });
    return NextResponse.json({
      ok: true,
      githubLogin: profile.login,
      rateLimit: {
        remaining: headers.get("x-ratelimit-remaining"),
        resetUnix: headers.get("x-ratelimit-reset"),
      },
    });
  } catch (error) {
    if (error instanceof GithubApiError && (error.status === 401 || error.status === 403)) {
      return NextResponse.json({ ok: false, code: "GITHUB_AUTH_INVALID" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, code: "GITHUB_UNAVAILABLE" }, { status: 503 });
  }
}
