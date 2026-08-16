import Link from "next/link";
import { ActionButtons } from "@/components/action-buttons";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const auth = typeof params.auth === "string" ? params.auth : undefined;

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 py-10">
      <div className="mb-10">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Deployment spike</div>
        <h1 className="text-4xl font-semibold tracking-tight">Issue Scout</h1>
        <p className="mt-3 text-zinc-400">Prove secure GitHub auth, PostgreSQL persistence, and lazy cache behavior before building issue discovery.</p>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-500">GitHub</div>
            <div className="font-medium">{user ? `Connected as ${user.githubLogin}` : "Not connected"}</div>
          </div>
          <span className={`h-3 w-3 rounded-full ${user ? "bg-emerald-400" : "bg-zinc-600"}`} />
        </div>
        {auth && <p className="mb-4 rounded-xl bg-white/5 p-3 text-sm text-zinc-300">Auth result: {auth}</p>}
        <ActionButtons connected={Boolean(user)} />
      </section>

      <div className="mt-6 flex justify-center text-sm text-zinc-500">
        <Link href="/internal/repositories" className="underline underline-offset-4">Seeded repositories</Link>
      </div>
    </main>
  );
}
