export type GithubUser = { id: number; login: string };

export class GithubApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "GithubApiError";
  }
}

export async function githubRequest<T>(token: string, path: string): Promise<{ data: T; headers: Headers }> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "github-issue-finder-spike",
    },
    cache: "no-store",
  });
  if (!response.ok) throw new GithubApiError(response.status, `GitHub API request failed (${response.status})`);
  return { data: (await response.json()) as T, headers: response.headers };
}

export async function exchangeOauthCode(code: string): Promise<string> {
  const { env } = await import("@/lib/env");
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: env.githubClientId(), client_secret: env.githubClientSecret(), code }),
    cache: "no-store",
  });
  const payload = (await response.json()) as { access_token?: string; error?: string };
  if (!response.ok || !payload.access_token) throw new Error(`OAuth exchange failed: ${payload.error ?? response.status}`);
  return payload.access_token;
}
