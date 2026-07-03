"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/useAuth";

export default function DashboardTopBar({ name }: { name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);
    await signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[rgba(250,248,245,0.85)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-lg font-bold text-white shadow-[0_2px_6px_rgba(61,107,79,0.35)]">
            O
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Oper<span className="text-forest">IA</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted sm:inline">
            Bonjour, <span className="font-semibold text-ink">{name}</span>
          </span>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "…" : "Déconnexion"}
          </button>
        </div>
      </div>
    </header>
  );
}
