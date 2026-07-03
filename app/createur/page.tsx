"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardTopBar from "../components/DashboardTopBar";
import {
  inputClass,
  Label,
  Select,
  ToggleChip,
} from "../components/FormControls";
import SectionCard from "../components/SectionCard";
import { displayName, updateProfile, type Profile } from "@/lib/auth";
import { useAuth } from "@/lib/useAuth";

const DOMAINES = [
  "SEO & Marketing",
  "Finance & Comptabilité",
  "Ressources Humaines",
  "Développement",
  "Support Client",
  "Juridique",
  "Autre",
];
const OUTILS = ["n8n", "Make", "Zapier", "Python", "JavaScript", "Autre"];

function completion(p: Profile): number {
  const fields = [
    p.nom_marque,
    p.bio,
    p.domaine,
    p.outils && p.outils.length > 0 ? "x" : "",
    p.lien_web,
  ];
  const filled = fields.filter((f) => f && String(f).trim() !== "").length;
  return Math.round((filled / fields.length) * 100);
}

export default function CreateurPage() {
  const router = useRouter();
  const { loading, user, profile } = useAuth();
  const [overrides, setOverrides] = useState<Partial<Profile>>({});

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nom_marque: "",
    bio: "",
    domaine: "",
    outils: [] as string[],
    lien_web: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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

  const current = { ...profile, ...overrides } as Profile;
  const name = displayName(current, user.email);
  const pct = completion(current);

  function toggleOutil(o: string) {
    setForm((f) => ({
      ...f,
      outils: f.outils.includes(o)
        ? f.outils.filter((x) => x !== o)
        : [...f.outils, o],
    }));
  }

  function startEdit() {
    setForm({
      nom_marque: current.nom_marque ?? "",
      bio: current.bio ?? "",
      domaine: current.domaine ?? "",
      outils: current.outils ?? [],
      lien_web: current.lien_web ?? "",
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

          {/* Revenus + abonnés */}
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
                <p className="mt-2 text-sm text-muted">
                  abonné pour l&apos;instant
                </p>
              </div>
            </SectionCard>
          </div>

          {/* Mon profil public */}
          <SectionCard
            title="Mon profil public"
            action={
              !editing ? (
                <button
                  type="button"
                  onClick={startEdit}
                  className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold"
                >
                  Modifier mon profil
                </button>
              ) : undefined
            }
          >
            {/* Indicateur de complétion */}
            <div className="mb-6 rounded-2xl bg-forest-soft/40 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-ink">Profil complété</span>
                <span className="font-semibold text-forest">{pct}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-forest transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {!editing ? (
              <dl className="divide-y divide-line">
                <InfoRow label="Nom de marque" value={current.nom_marque} />
                <InfoRow label="Bio" value={current.bio} />
                <InfoRow label="Domaine" value={current.domaine} />
                <InfoRow
                  label="Outils"
                  value={current.outils?.join(", ") || null}
                />
                <InfoRow label="Lien web" value={current.lien_web} />
              </dl>
            ) : (
              <div className="flex flex-col gap-5">
                <div>
                  <Label htmlFor="nomMarque">Nom de marque / pseudo</Label>
                  <input
                    id="nomMarque"
                    value={form.nom_marque}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, nom_marque: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio courte</Label>
                  <textarea
                    id="bio"
                    value={form.bio}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        bio: e.target.value.slice(0, 150),
                      }))
                    }
                    maxLength={150}
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                  <p className="mt-1 text-right text-xs text-muted">
                    {form.bio.length} / 150
                  </p>
                </div>
                <div>
                  <Label>Domaine d&apos;expertise</Label>
                  <Select
                    value={form.domaine}
                    onChange={(v) => setForm((f) => ({ ...f, domaine: v }))}
                    placeholder="Sélectionnez…"
                    options={DOMAINES}
                  />
                </div>
                <div>
                  <Label>Outils maîtrisés</Label>
                  <div className="flex flex-wrap gap-2.5">
                    {OUTILS.map((o) => (
                      <ToggleChip
                        key={o}
                        selected={form.outils.includes(o)}
                        onClick={() => toggleOutil(o)}
                      >
                        {o}
                      </ToggleChip>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="lienWeb">Lien LinkedIn ou site web</Label>
                  <input
                    id="lienWeb"
                    type="url"
                    value={form.lien_web}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, lien_web: e.target.value }))
                    }
                    placeholder="https://…"
                    className={inputClass}
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
    <div className="flex items-start justify-between gap-6 py-3 first:pt-0 last:pb-0">
      <dt className="shrink-0 text-sm text-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">
        {value || <span className="text-muted/60">—</span>}
      </dd>
    </div>
  );
}
