"use client";

import { useState } from "react";

export function ActionButtons({ connected }: { connected: boolean }) {
  const [status, setStatus] = useState<string>("");

  async function check(path: string) {
    setStatus("Checking…");
    try {
      const response = await fetch(path, { cache: "no-store" });
      const data = await response.json();
      setStatus(JSON.stringify(data, null, 2));
    } catch {
      setStatus("Request failed.");
    }
  }

  if (!connected) {
    return <a className="block rounded-2xl bg-white px-5 py-4 text-center font-semibold text-black" href="/api/auth/github/start">Connect GitHub</a>;
  }

  return (
    <div className="space-y-3">
      <button onClick={() => check("/api/github/health")} className="w-full rounded-2xl bg-white px-5 py-4 font-semibold text-black">Check GitHub connection</button>
      <button onClick={() => check("/api/cache-test")} className="w-full rounded-2xl border border-white/20 px-5 py-4 font-semibold">Test lazy cache</button>
      {status && <pre className="overflow-x-auto rounded-2xl bg-black/40 p-4 text-xs leading-5 text-zinc-300">{status}</pre>}
    </div>
  );
}
