# Verification status

## Confirmed in this environment

- Project structure generated manually from current Next.js App Router conventions.
- `package.json` parses as valid JSON.
- No source file includes `NEXT_PUBLIC_` secret names.
- OAuth route does not request `repo` scope.
- GitHub allowed numeric user ID is wired through environment configuration.
- OAuth state is one-time, hashed in PostgreSQL, and expires after 10 minutes.
- GitHub token is encrypted with AES-256-GCM before database storage.
- Session cookie is opaque; only a keyed hash is stored in PostgreSQL.
- Lazy cache has explicit `fetchedAt` / `expiresAt` behavior and stale-cache fallback.
- No cron/background worker code exists.

## BLOCKED: dependency/build verification — npm registry unreachable from this execution container

The environment timed out on both `npx create-next-app@latest` and `npm view next version`, so dependencies could not be installed and these checks remain mandatory on a networked machine/CI:

```text
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run typecheck
npm test
npm run build
```

## BLOCKED: deployment acceptance — external credentials/resources required

Requires:
- Render account/service + PostgreSQL instance.
- Registered GitHub OAuth App credentials.
- Deployed HTTPS callback URL.
- Actual iPhone Safari OAuth test.
- GitHub App registration for the second half of the auth comparison.
