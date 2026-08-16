function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const env = {
  databaseUrl: () => required("DATABASE_URL"),
  appBaseUrl: () => required("APP_BASE_URL").replace(/\/$/, ""),
  allowedGithubUserId: () => required("ALLOWED_GITHUB_USER_ID"),
  githubClientId: () => required("GITHUB_CLIENT_ID"),
  githubClientSecret: () => required("GITHUB_CLIENT_SECRET"),
  tokenEncryptionKey: () => required("TOKEN_ENCRYPTION_KEY"),
  sessionSecret: () => required("SESSION_SECRET"),
};
