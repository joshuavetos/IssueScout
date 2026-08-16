import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { issueOauthState } from "@/lib/auth/oauth-state";

export const runtime = "nodejs";

export async function GET() {
  const state = await issueOauthState();
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", env.githubClientId());
  authorize.searchParams.set("redirect_uri", `${env.appBaseUrl()}/api/auth/github/callback`);
  authorize.searchParams.set("state", state);
  // No repo scope for public-repo-only spike. GitHub still returns public user identity.
  return NextResponse.redirect(authorize);
}
