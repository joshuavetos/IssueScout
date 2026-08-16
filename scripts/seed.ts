import { getDb, getPool } from "../src/lib/db/index";
import { repository } from "../src/lib/db/schema";

const repos = [
  ["future-agi", "futureagi-sdk", "Primary spike repo; user has already worked in this ecosystem."],
  ["Textualize", "textual", "Spike-only public repo."],
  ["pytest-dev", "pytest", "Spike-only public repo."],
  ["pydantic", "pydantic", "Spike-only public repo."],
  ["astral-sh", "ruff", "Spike-only public repo."],
] as const;

for (const [owner, name, note] of repos) {
  const existing = await getDb().select().from(repository);
  if (!existing.some((row) => row.owner === owner && row.name === name)) {
    await getDb().insert(repository).values({ owner, name, note, enabled: true });
  }
}
await getPool().end();
console.log("SEED_OK");
