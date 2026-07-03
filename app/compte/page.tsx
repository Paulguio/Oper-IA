"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  GoogleLogo,
  NotionLogo,
  SlackLogo,
} from "../components/BrandLogos";
import DashboardTopBar from "../components/DashboardTopBar";
import SectionCard from "../components/SectionCard";
import { useAuth } from "@/lib/useAuth";

type Tool = {
  name: string;
  Logo: (props: { className?: string }) => React.ReactElement;
  connected: boolean;
};

const INITIAL_TOOLS: Tool[] = [
  { name: "Google", Logo: GoogleLogo, connected: true },
  { name: "Slack", Logo: SlackLogo, connected: false },
  { name: "Notion", Logo: NotionLogo, connected: false },
];

export default function ComptePage() {
  const router = useRouter();
  const { loading, user, profile } = useAuth();
  const [tools, setTools] = useState<Tool[]>(INITIAL_TOOLS);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/connexion?redirect=/compte");
    } else if (profile && profile.role !== "utilisateur") {
      router.replace("/createur");
    }
  }, [loading, user, profile, router]);

  if (loading || !user || (profile && profile.role !== "utilisateur")) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-beige text-muted">
        Chargement…
      </div>
    );
  }

  const name = profile?.nom || user.email?.split("@")[0] || "Utilisateur";

  function toggleTool(toolName: string) {
    setTools((prev) =>
      prev.map((t) =>
        t.name === toolName ? { ...t, connected: !t.connected } : t,
      ),
    );
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-beige text-ink">
      <DashboardTopBar name={name} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 sm:py-14">
        <div className="mb-8">
          <p className="label text-forest">Espace utilisateur</p>
          <h1 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Bonjour, {name}
          </h1>
        </div>

        <div className="grid gap-6">
          {/* Mes agents actifs */}
          <SectionCard title="Mes agents actifs">
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-beige/60 px-6 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-soft text-2xl text-forest">
                ◆
              </span>
              <p className="mt-4 font-medium text-ink">Aucun agent actif</p>
              <p className="mt-1 text-sm text-muted">
                Parcourez le catalogue pour activer votre premier métier IA.
              </p>
              <Link
                href="/catalogue"
                className="btn-primary mt-6 rounded-full px-6 py-2.5 text-sm font-semibold"
              >
                Explorer le catalogue
              </Link>
            </div>
          </SectionCard>

          {/* Mes connexions d'outils */}
          <SectionCard title="Mes connexions d'outils">
            <ul className="divide-y divide-line">
              {tools.map((tool) => (
                <li
                  key={tool.name}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white">
                      <tool.Logo className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-medium text-ink">{tool.name}</div>
                      <div
                        className={`flex items-center gap-1.5 text-xs ${
                          tool.connected ? "text-forest" : "text-muted"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            tool.connected ? "bg-forest" : "bg-muted/50"
                          }`}
                        />
                        {tool.connected ? "Connecté" : "Déconnecté"}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTool(tool.name)}
                    className={
                      tool.connected
                        ? "btn-secondary rounded-full px-4 py-2 text-sm font-semibold"
                        : "btn-primary rounded-full px-4 py-2 text-sm font-semibold"
                    }
                  >
                    {tool.connected ? "Déconnecter" : "Connecter"}
                  </button>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Mon abonnement */}
          <SectionCard
            title="Mon abonnement"
            action={
              <button
                type="button"
                className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold"
              >
                Gérer
              </button>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-forest-soft/50 p-5">
                <div className="label text-forest">Plan actuel</div>
                <div className="mt-1.5 text-xl font-semibold text-ink">
                  Essai gratuit
                </div>
              </div>
              <div className="rounded-2xl border border-line p-5">
                <div className="label text-muted">Renouvellement</div>
                <div className="mt-1.5 text-xl font-semibold text-ink">
                  10 juillet 2026
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Mes informations */}
          <SectionCard
            title="Mes informations"
            action={
              <button
                type="button"
                className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold"
              >
                Modifier
              </button>
            }
          >
            <dl className="divide-y divide-line">
              <div className="flex items-center justify-between py-3 first:pt-0">
                <dt className="text-sm text-muted">Nom</dt>
                <dd className="font-medium text-ink">{name}</dd>
              </div>
              <div className="flex items-center justify-between py-3 last:pb-0">
                <dt className="text-sm text-muted">Email</dt>
                <dd className="font-medium text-ink">{user.email}</dd>
              </div>
            </dl>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}
