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
import { inputClass, Label, Select } from "../components/FormControls";
import SectionCard from "../components/SectionCard";
import {
  displayName,
  updateProfile,
  type Profile,
} from "@/lib/auth";
import { useAuth } from "@/lib/useAuth";

const SECTEURS = [
  "E-commerce",
  "Conseil / Consulting",
  "Agence marketing",
  "Immobilier",
  "Finance / Comptabilité",
  "Juridique",
  "Technologie / SaaS",
  "Santé",
  "Education",
  "Autre",
];

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
  const [overrides, setOverrides] = useState<Partial<Profile>>({});

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    entreprise: "",
    secteur: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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

  const current = { ...profile, ...overrides } as Profile;
  const name = displayName(current, user.email);

  function toggleTool(toolName: string) {
    setTools((prev) =>
      prev.map((t) =>
        t.name === toolName ? { ...t, connected: !t.connected } : t,
      ),
    );
  }

  function startEdit() {
    setForm({
      prenom: current.prenom ?? "",
      nom: current.nom ?? "",
      entreprise: current.entreprise ?? "",
      secteur: current.secteur ?? "",
    });
    setSaveError(null);
    setEditing(true);
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    setSaveError(null);
    const { error } = await updateProfile(user!.id, form);
    setSaving(false);
    if (error) {
      setSaveError(
        "Échec de l'enregistrement. Vérifiez que le script update-profiles.sql a bien été exécuté.",
      );
      return;
    }
    setOverrides((prev) => ({ ...prev, ...form }));
    setEditing(false);
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
              !editing ? (
                <button
                  type="button"
                  onClick={startEdit}
                  className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold"
                >
                  Modifier
                </button>
              ) : undefined
            }
          >
            {!editing ? (
              <dl className="divide-y divide-line">
                <InfoRow label="Prénom" value={current.prenom} />
                <InfoRow label="Nom" value={current.nom} />
                <InfoRow label="Entreprise" value={current.entreprise} />
                <InfoRow label="Secteur" value={current.secteur} />
                <InfoRow label="Email" value={user.email} />
              </dl>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="prenom">Prénom</Label>
                    <input
                      id="prenom"
                      value={form.prenom}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, prenom: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nom">Nom</Label>
                    <input
                      id="nom"
                      value={form.nom}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, nom: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="entreprise">Entreprise</Label>
                  <input
                    id="entreprise"
                    value={form.entreprise}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, entreprise: e.target.value }))
                    }
                    placeholder="Votre entreprise ou nom complet"
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label>Secteur</Label>
                  <Select
                    value={form.secteur}
                    onChange={(v) => setForm((f) => ({ ...f, secteur: v }))}
                    placeholder="Sélectionnez…"
                    options={SECTEURS}
                  />
                </div>

                {saveError && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {saveError}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="btn-secondary rounded-full px-5 py-2.5 text-sm font-semibold"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={save}
                    disabled={saving}
                    className="btn-primary rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
                  >
                    {saving ? "Enregistrement…" : "Enregistrer"}
                  </button>
                </div>
              </div>
            )}
          </SectionCard>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-medium text-ink">
        {value || <span className="text-muted/60">—</span>}
      </dd>
    </div>
  );
}
