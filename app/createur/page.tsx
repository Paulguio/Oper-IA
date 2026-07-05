"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import DashboardTopBar from "../components/DashboardTopBar";
import { inputClass, Label, Select, ToggleChip } from "../components/FormControls";
import { displayName, updateProfile, type Profile } from "@/lib/auth";
import { useAuth } from "@/lib/useAuth";

/* ------------------------------------------------------------------ */
/* Données statiques                                                    */
/* ------------------------------------------------------------------ */

const TABS = [
  { id: "agents", label: "Mes agents" },
  { id: "revenus", label: "Mes revenus" },
  { id: "abonnes", label: "Mes abonnés" },
  { id: "profil", label: "Mon profil créateur" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const DOMAINES = [
  "SEO & Marketing",
  "Finance & Comptabilité",
  "Ressources Humaines",
  "Développement",
  "Support Client",
  "Juridique",
  "Autre",
];
const OUTILS = ["n8n", "Make", "Zapier", "Python", "JavaScript"];

const AGENT_TYPES = [
  {
    icon: "◆",
    title: "Prompt simple",
    description:
      "Un agent piloté par une instruction. Idéal pour démarrer sans aucune configuration technique.",
  },
  {
    icon: "⇄",
    title: "Webhook",
    description:
      "Connectez votre agent à un service externe via une URL. L'agent envoie et reçoit des données en temps réel.",
  },
  {
    icon: "❖",
    title: "Workflow JSON",
    description:
      "Orchestrez plusieurs étapes et outils dans un flux complet, décrit en JSON. Pour les automatisations avancées.",
  },
];

const REVENUE_TIPS = [
  {
    icon: "✎",
    title: "Soignez la qualité du prompt",
    description:
      "Un prompt précis et bien testé produit des résultats fiables — c'est ce qui fidélise vos abonnés.",
  },
  {
    icon: "⇄",
    title: "Ajoutez des connecteurs OAuth",
    description:
      "Les agents connectés aux vrais outils (Google, Slack…) ont bien plus de valeur perçue.",
  },
  {
    icon: "❖",
    title: "Rédigez une documentation claire",
    description:
      "Expliquez ce que fait votre agent et comment l'utiliser : la confiance accélère les abonnements.",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function brandInitials(brand: string, email?: string | null) {
  const words = brand.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words[0]) return words[0].slice(0, 2).toUpperCase();
  return (email?.slice(0, 2) ?? "C").toUpperCase();
}

function memberSince(iso: string): string {
  if (!iso) return "récemment";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "récemment";
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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

type Toast = { key: number; type: "success" | "error"; msg: string };

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function CreateurPage() {
  const router = useRouter();
  const { loading, user, profile } = useAuth();

  const [tab, setTab] = useState<TabId>("agents");
  const [overrides, setOverrides] = useState<Partial<Profile>>({});
  const [toast, setToast] = useState<Toast | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/connexion?redirect=/createur");
    } else if (profile && profile.role !== "createur") {
      router.replace("/compte");
    }
  }, [loading, user, profile, router]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  if (loading || !user || (profile && profile.role !== "createur")) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-beige text-muted">
        Chargement…
      </div>
    );
  }

  const current = { ...profile, ...overrides } as Profile;
  const brand = current.nom_marque || displayName(current, user.email);
  const pct = completion(current);

  function showToast(type: Toast["type"], msg: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ key: Date.now(), type, msg });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-beige text-ink">
      <DashboardTopBar name={brand} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8 sm:py-10">
        {/* ===== Header ===== */}
        <div className="card p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-forest text-lg font-bold text-white shadow-[0_2px_10px_rgba(61,107,79,0.35)]">
                {brandInitials(brand, user.email)}
              </span>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                    {brand}
                  </h1>
                  <span className="rounded-full bg-forest-soft px-2.5 py-0.5 text-xs font-semibold text-forest-dark">
                    Créateur
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  Membre depuis {memberSince(current.created_at)}
                </p>
              </div>
            </div>

            {/* Complétion du profil */}
            <div className="w-full sm:w-56">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-ink">Profil complété</span>
                <span className="font-semibold text-forest">{pct}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-beige-deep">
                <div
                  className="h-full rounded-full bg-forest transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Onglets ===== */}
        <div className="mt-6 border-b border-line">
          <div className="-mb-px flex gap-1 overflow-x-auto">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                    active
                      ? "border-forest text-forest"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== Contenu (fade-in) ===== */}
        <div key={tab} className="msg-in mt-8">
          {tab === "agents" && (
            <TabAgents onPublish={() => setShowPublishModal(true)} />
          )}
          {tab === "revenus" && <TabRevenus />}
          {tab === "abonnes" && (
            <TabAbonnes userId={user.id} onToast={showToast} />
          )}
          {tab === "profil" && (
            <TabProfil
              current={current}
              userId={user.id}
              onSaved={(patch) => {
                setOverrides((prev) => ({ ...prev, ...patch }));
                showToast("success", "Profil mis à jour ✓");
              }}
              onError={() =>
                showToast("error", "Échec de la mise à jour. Veuillez réessayer.")
              }
            />
          )}
        </div>
      </main>

      {/* ===== Modal publication ===== */}
      {showPublishModal && (
        <ComingSoonModal onClose={() => setShowPublishModal(false)} />
      )}

      {/* ===== Toast ===== */}
      {toast && (
        <div
          key={toast.key}
          role="status"
          className={`msg-in fixed right-4 top-4 z-[100] flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold shadow-[var(--shadow-card-hover)] ${
            toast.type === "success"
              ? "bg-forest text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <span>{toast.type === "success" ? "✓" : "⚠"}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/* Onglet — Mes agents                                                 */
/* ================================================================== */

function TabAgents({ onPublish }: { onPublish: () => void }) {
  return (
    <div className="grid gap-6">
      <section className="card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              Mes agents publiés
            </h2>
            <p className="mt-1 text-sm text-muted">
              Créez, publiez et monétisez vos métiers IA.
            </p>
          </div>
          <button
            type="button"
            onClick={onPublish}
            className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
          >
            Publier mon premier agent
            <span aria-hidden className="text-base leading-none">
              +
            </span>
          </button>
        </div>

        {/* Placeholder aucun agent */}
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-line bg-beige/50 px-6 py-14 text-center">
          <svg
            viewBox="0 0 64 64"
            className="h-16 w-16 text-forest/30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect x="10" y="16" width="44" height="34" rx="6" />
            <path d="M10 26h44" />
            <path d="M24 40h16" />
            <circle cx="17" cy="21" r="1.4" fill="currentColor" />
            <circle cx="22" cy="21" r="1.4" fill="currentColor" />
          </svg>
          <p className="mt-5 max-w-md leading-7 text-muted">
            Vous n&apos;avez pas encore publié d&apos;agent. Commencez dès
            aujourd&apos;hui et générez vos premiers revenus récurrents.
          </p>
        </div>
      </section>

      {/* Types d'agents */}
      <section className="card p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Trois façons de créer un agent
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {AGENT_TYPES.map((t) => (
            <div
              key={t.title}
              className="flex h-full flex-col rounded-2xl border border-line bg-white p-5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-soft text-xl text-forest">
                {t.icon}
              </span>
              <h3 className="mt-4 font-semibold text-ink">{t.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                {t.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ================================================================== */
/* Onglet — Mes revenus                                                */
/* ================================================================== */

function TabRevenus() {
  const kpis = [
    { label: "Revenus ce mois", value: "0€" },
    { label: "Revenus total", value: "0€" },
    { label: "Commission OperIA", value: "15%" },
    { label: "Prochaine payout", value: "—" },
  ];
  const months = ["Fév", "Mar", "Avr", "Mai", "Juin", "Juil"];

  return (
    <div className="grid gap-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="card p-5">
            <div className="label text-muted">{k.label}</div>
            <div className="font-display mt-2 text-3xl font-bold text-forest">
              {k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Graphique vide */}
      <section className="card p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Évolution des revenus
        </h2>
        <div className="mt-6 flex h-44 items-end gap-3">
          {months.map((m) => (
            <div key={m} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md bg-line/70"
                style={{ height: "8px" }}
              />
              <span className="text-xs text-muted">{m}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center rounded-xl bg-beige/70 py-3 text-xs text-muted">
          Vos revenus apparaîtront ici dès votre premier abonné.
        </div>
      </section>

      {/* Conseils */}
      <section className="card p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Comment maximiser vos revenus
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {REVENUE_TIPS.map((t) => (
            <div
              key={t.title}
              className="flex h-full flex-col rounded-2xl border border-line bg-white p-5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-soft text-xl text-forest">
                {t.icon}
              </span>
              <h3 className="mt-4 font-semibold text-ink">{t.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                {t.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ================================================================== */
/* Onglet — Mes abonnés                                                */
/* ================================================================== */

function TabAbonnes({
  userId,
  onToast,
}: {
  userId: string;
  onToast: (type: "success" | "error", msg: string) => void;
}) {
  const path = `/createurs/${userId}`;

  function copyLink() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${path}`
        : path;
    navigator.clipboard
      .writeText(url)
      .then(() => onToast("success", "Lien copié ✓"))
      .catch(() => onToast("error", "Impossible de copier le lien."));
  }

  return (
    <div className="grid gap-6">
      {/* Compteur */}
      <section className="card p-6 sm:p-8">
        <div className="flex flex-col items-center py-8 text-center">
          <svg
            viewBox="0 0 64 64"
            className="h-16 w-16 text-forest/30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="24" cy="24" r="10" />
            <path d="M8 52c0-9 7-14 16-14s16 5 16 14" />
            <path d="M44 20a10 10 0 010 20M50 52c0-7-3-11-8-13" />
          </svg>
          <span className="font-display mt-5 text-5xl font-bold text-forest">
            0
          </span>
          <p className="mt-2 text-sm text-muted">abonné pour l&apos;instant</p>
          <p className="mt-5 max-w-md leading-7 text-muted">
            Chaque grand créateur a commencé avec 0 abonné. Publiez votre
            premier agent et partagez-le sur LinkedIn&nbsp;!
          </p>
        </div>
      </section>

      {/* Partager mon profil */}
      <section className="card p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Partager mon profil
        </h2>
        <p className="mt-1 text-sm text-muted">
          Diffusez ce lien pour attirer vos premiers abonnés.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center overflow-hidden rounded-xl border border-line bg-beige px-4 py-3 text-sm text-muted">
            <span className="truncate">{path}</span>
          </div>
          <button
            type="button"
            onClick={copyLink}
            className="btn-primary shrink-0 rounded-xl px-6 py-3 text-sm font-semibold"
          >
            Copier le lien
          </button>
        </div>
      </section>
    </div>
  );
}

/* ================================================================== */
/* Onglet — Mon profil créateur                                        */
/* ================================================================== */

const BIO_MAX = 150;

function TabProfil({
  current,
  userId,
  onSaved,
  onError,
}: {
  current: Profile;
  userId: string;
  onSaved: (patch: Partial<Profile>) => void;
  onError: () => void;
}) {
  const [edits, setEdits] = useState<{
    nom_marque?: string;
    bio?: string;
    domaine?: string;
    lien_web?: string;
  }>({});
  const [outilsEdit, setOutilsEdit] = useState<string[] | null>(null);
  const [saving, setSaving] = useState(false);

  const nomMarque = edits.nom_marque ?? current.nom_marque ?? "";
  const bio = edits.bio ?? current.bio ?? "";
  const domaine = edits.domaine ?? current.domaine ?? "";
  const lienWeb = edits.lien_web ?? current.lien_web ?? "";
  const outils = outilsEdit ?? current.outils ?? [];

  function toggleOutil(o: string) {
    setOutilsEdit((prev) => {
      const base = prev ?? current.outils ?? [];
      return base.includes(o)
        ? base.filter((x) => x !== o)
        : [...base, o];
    });
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    const patch: Partial<Profile> = {
      nom_marque: nomMarque,
      bio,
      domaine,
      lien_web: lienWeb,
      outils,
    };
    const { error } = await updateProfile(userId, patch);
    setSaving(false);
    if (error) {
      onError();
      return;
    }
    setEdits({});
    setOutilsEdit(null);
    onSaved(patch);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Formulaire */}
      <section className="card p-6 sm:p-8 lg:col-span-3">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Mon profil créateur
        </h2>
        <form onSubmit={handleSave} className="mt-6 flex flex-col gap-5">
          <div>
            <Label htmlFor="nom_marque">Nom de marque</Label>
            <input
              id="nom_marque"
              type="text"
              value={nomMarque}
              onChange={(e) =>
                setEdits((s) => ({ ...s, nom_marque: e.target.value }))
              }
              placeholder="Studio Nyx"
              className={inputClass}
            />
          </div>

          <div>
            <Label htmlFor="bio" hint={`${bio.length}/${BIO_MAX}`}>
              Bio
            </Label>
            <textarea
              id="bio"
              rows={3}
              maxLength={BIO_MAX}
              value={bio}
              onChange={(e) =>
                setEdits((s) => ({ ...s, bio: e.target.value }))
              }
              placeholder="Présentez votre expertise en quelques mots…"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <Label htmlFor="domaine">Domaine d&apos;expertise</Label>
            <Select
              id="domaine"
              value={domaine}
              onChange={(v) => setEdits((s) => ({ ...s, domaine: v }))}
              placeholder="Choisir un domaine"
              options={DOMAINES}
            />
          </div>

          <div>
            <Label>Outils maîtrisés</Label>
            <div className="flex flex-wrap gap-2.5">
              {OUTILS.map((o) => (
                <ToggleChip
                  key={o}
                  selected={outils.includes(o)}
                  onClick={() => toggleOutil(o)}
                >
                  {o}
                </ToggleChip>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="lien_web">Lien LinkedIn / site web</Label>
            <input
              id="lien_web"
              type="url"
              value={lienWeb}
              onChange={(e) =>
                setEdits((s) => ({ ...s, lien_web: e.target.value }))
              }
              placeholder="https://linkedin.com/in/…"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary rounded-full px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
            >
              {saving ? "Enregistrement…" : "Sauvegarder"}
            </button>
            <Link
              href={`/createurs/${userId}`}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-forest-dark"
            >
              Voir mon profil public
              <span className="btn-arrow" aria-hidden>
                →
              </span>
            </Link>
          </div>
        </form>
      </section>

      {/* Aperçu en temps réel */}
      <div className="lg:col-span-2">
        <p className="label mb-3 text-muted">Aperçu du profil public</p>
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-base font-bold text-white">
              {brandInitials(nomMarque || "Créateur")}
            </span>
            <div className="min-w-0">
              <div className="truncate font-display text-lg font-bold tracking-tight text-ink">
                {nomMarque || "Nom de marque"}
              </div>
              {domaine && (
                <div className="truncate text-xs font-medium text-forest">
                  {domaine}
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 min-h-[3.5rem] text-sm leading-6 text-muted">
            {bio || "Votre bio apparaîtra ici…"}
          </p>

          {outils.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {outils.map((o) => (
                <span
                  key={o}
                  className="rounded-full bg-forest-soft px-2.5 py-1 text-xs font-medium text-forest-dark"
                >
                  {o}
                </span>
              ))}
            </div>
          )}

          {lienWeb && (
            <div className="mt-4 truncate text-sm font-medium text-forest">
              🔗 {lienWeb}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Modal "Fonctionnalité disponible prochainement"                     */
/* ================================================================== */

function ComingSoonModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="msg-in card w-full max-w-sm p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-soft text-2xl text-forest">
          ⚡
        </span>
        <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
          Fonctionnalité disponible prochainement
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          La publication d&apos;agents arrive très bientôt. Vous pourrez créer
          et monétiser vos propres métiers IA en quelques clics.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="btn-primary mt-6 w-full rounded-full px-6 py-2.5 text-sm font-semibold"
        >
          J&apos;ai hâte&nbsp;!
        </button>
      </div>
    </div>
  );
}
