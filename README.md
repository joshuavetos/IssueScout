# Issue Scout — deployment spike

This repository is intentionally **not the issue finder yet**. It proves the V1 foundation before we invest in candidate scoring:

1. Next.js App Router running as a normal Node service.
2. PostgreSQL persistence via Drizzle.
3. Server-only GitHub OAuth web flow with one allowed GitHub numeric user ID.
4. Encrypted GitHub token storage and opaque server sessions.
5. One authenticated GitHub API health check.
6. Lazy TTL cache behavior against one public repository.
7. Five manually seeded public repositories.

## Deliberately excluded

No cron, Redis/KV, private repositories, repository discovery, LLM, embeddings, cloning, background indexing, issue scoring, PR collision scoring, or GitHub mutations.

## Important status

The code implements the **OAuth App** side of the authentication spike first because it is the simpler browser flow. The GitHub App alternative is not declared the winner. The comparison cannot be completed until both app registrations can be exercised on the deployed URL. See `AUTH_SPIKE.md`.

## Environment

Copy `.env.example` to `.env.local` and supply the missing values. The configured allowed GitHub user ID in this spike is `211133238`.

Generate 32-byte base64 secrets locally:

```bash
openssl rand -base64 32
```

`TOKEN_ENCRYPTION_KEY` must decode to exactly 32 bytes. `SESSION_SECRET` should also be high entropy.

## Local setup

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## GitHub OAuth App setup

Register an OAuth App with:

- Homepage: your deployed HTTPS URL.
- Callback: `<APP_BASE_URL>/api/auth/github/callback`.
- Device flow: disabled.
- Public-repository spike: request no `repo` scope.

The callback validates a one-time hashed `state`, exchanges the code server-side, fetches `/user`, rejects any numeric GitHub ID other than `ALLOWED_GITHUB_USER_ID`, encrypts the token with AES-256-GCM, and issues an opaque HttpOnly/Secure/SameSite=Lax session cookie.

## Database migration policy

Do **not** run migrations from application startup. Run `npm run db:migrate` explicitly during initial setup/deployment. The web process only reads/writes the migrated schema.

## Spike checks

After deployment from an iPhone:

1. Open site over HTTPS.
2. Connect GitHub.
3. Confirm it returns as the allowed account.
4. Reload; session persists.
5. Tap **Check GitHub connection**.
6. Tap **Test lazy cache** twice. First request should say `source: github`; second within 10 minutes should say `source: cache`.
7. Revoke OAuth authorization on GitHub and confirm the health endpoint returns an auth failure instead of pretending the connection is healthy.
8. Confirm DB/logs/browser never contain a plaintext GitHub token.

## Verification commands

```bash
npm run typecheck
npm test
npm run build
```

The current ChatGPT execution environment could not reach npm, so dependency installation and the actual Next.js production build could not be executed here. Syntax/configuration checks performed without dependencies are recorded in `VERIFICATION.md`. Do not treat the deployment spike as passed until the three commands above succeed with a real PostgreSQL database and the iPhone/OAuth checks are completed.
