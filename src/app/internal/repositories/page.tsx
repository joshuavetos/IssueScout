import { asc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { repository } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function RepositoriesPage() {
  const user = await getCurrentUser();
  if (!user) return <main className="mx-auto max-w-md p-6">Connect GitHub first.</main>;
  const repos = await getDb().select().from(repository).orderBy(asc(repository.owner), asc(repository.name));
  return (
    <main className="mx-auto min-h-screen max-w-md px-5 py-10">
      <h1 className="text-2xl font-semibold">Seeded repositories</h1>
      <p className="mt-2 text-sm text-zinc-500">Spike-only pool. Eligibility scoring is intentionally not implemented yet.</p>
      <div className="mt-6 space-y-3">
        {repos.map((repo) => (
          <div key={repo.id} className="rounded-2xl border border-white/10 p-4">
            <div className="font-medium">{repo.owner}/{repo.name}</div>
            <div className="mt-1 text-xs text-zinc-500">{repo.enabled ? "enabled" : "disabled"} · {repo.note ?? "no note"}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
