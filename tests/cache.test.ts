import assert from "node:assert/strict";
import test from "node:test";
import { isFresh } from "../src/lib/cache";

test("isFresh accepts unexpired entries", () => {
  assert.equal(isFresh(new Date("2030-01-01T00:00:01Z"), new Date("2030-01-01T00:00:00Z")), true);
});

test("isFresh rejects expired entries", () => {
  assert.equal(isFresh(new Date("2030-01-01T00:00:00Z"), new Date("2030-01-01T00:00:01Z")), false);
});
