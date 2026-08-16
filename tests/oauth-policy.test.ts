import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

const startRoute = fs.readFileSync("src/app/api/auth/github/start/route.ts", "utf8");
const envExample = fs.readFileSync(".env.example", "utf8");

test("public-only OAuth start route does not request repo scope", () => {
  assert.equal(startRoute.includes('scope'), false);
});

test("secret environment variables are not NEXT_PUBLIC", () => {
  for (const name of ["DATABASE_URL", "GITHUB_CLIENT_SECRET", "TOKEN_ENCRYPTION_KEY", "SESSION_SECRET"]) {
    assert.match(envExample, new RegExp(`^${name}=`, "m"));
    assert.equal(envExample.includes(`NEXT_PUBLIC_${name}`), false);
  }
});
