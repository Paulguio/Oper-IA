"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardTopBar from "../components/DashboardTopBar";
import SectionCard from "../components/SectionCard";
import { useAuth } from "@/lib/useAuth";

export default function CreateurPage() {
  const router = useRouter();
  const { loading, user, profile } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/connexion?redirect=/createur");
    } else if (profile && profile.role !== "createur") {
      router.replace("/compte");
    }
  }, [loading, user, profile, router]);

  if (loading || !user || (profile && profile.role !== "createur")) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-beige text-muted">
        Chargement…
      </div>
    );
  }

  const name = profile?.nom || user.email?.split("@")[0] || "Créateur";

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-beige text-ink">
      <DashboardTopBar name={name} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 sm:py-14">
        <div className="mb-8">
          <p className="label text-forest">Espace créateur</p>
          <h1 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Bonjour, {name}
          </h1>
        </div>

        <div className="grid gap-6">
          {/* Mes agents publiés */}
          <SectionCard title="Mes agents publiés">
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-beige/60 px-6 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-soft text-2xl text-forest">
                ❖
              </span>
              <p className="mt-4 font-medium text-ink">Aucun agent publié</p>
              <p className="mt-1 text-sm text-muted">
                Publiez votre premier métier IA et commencez à générer des
                revenus.
              </p>
              <button
                type="button"
                className="btn-primary mt-6 rounded-full px-6 py-2.5 text-sm font-semibold"
              >
                Publier mon premier agent
              </button>
            </div>
          </SectionCard>

          {/* Mes revenus + Mes abonnés */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionCard
                title="Mes revenus"
                action={
                  <span className="font-display text-2xl font-bold text-forest">
                    0€
                  </span>
                }
              >
                <p className="text-sm text-muted">Ce mois-ci</p>
                {/* Graphique vide */}
                <div className="mt-4 flex h-40 items-end gap-3">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md bg-line/70"
                      style={{ height: "8px" }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-center rounded-xl bg-beige/70 py-3 text-xs text-muted">
                  Aucune donnée pour le moment — vos revenus s&apos;afficheront
                  ici.
                </div>
              </SectionCard>
            </div>

            <SectionCard title="Mes abonnés">
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <span className="font-display text-5xl font-bold text-forest">
                  0
                </span>
                <p className="mt-2 text-sm text-muted">abonné pour l&apos;instant</p>
              </div>
            </SectionCard>
          </div>

          {/* Mon profil public */}
          <SectionCard
            title="Mon profil public"
            action={
              <button
                type="button"
                className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold"
              >
                Voir le profil public
              </button>
            }
          >
            <dl className="divide-y divide-line">
              <div className="flex items-center justify-between py-3 first:pt-0">
                <dt className="text-sm text-muted">Nom</dt>
                <dd className="font-medium text-ink">{name}</dd>
              </div>
              <div className="flex items-start justify-between gap-6 py-3 last:pb-0">
                <dt className="shrink-0 text-sm text-muted">Bio</dt>
                <dd className="text-right text-sm text-muted italic">
                  Ajoutez une bio pour présenter vos agents…
                </dd>
              </div>
            </dl>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}
