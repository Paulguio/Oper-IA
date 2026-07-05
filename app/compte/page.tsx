"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  GmailLogo,
  GoogleLogo,
  NotionLogo,
  SlackLogo,
} from "../components/BrandLogos";
import DashboardTopBar from "../components/DashboardTopBar";
import { inputClass, Label, Select } from "../components/FormControls";
import { displayName, updateProfile, type Profile } from "@/lib/auth";
import { signOut, useAuth } from "@/lib/useAuth";

/* ------------------------------------------------------------------ */
/* Données statiques                                                    */
/* ------------------------------------------------------------------ */

const TABS = [
  { id: "agents", label: "Mes agents" },
  { id: "outils", label: "Mes outils" },
  { id: "abonnement", label: "Mon abonnement" },
  { id: "profil", label: "Mon profil" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const OTHER_AGENTS = [
  { name: "Directeur Marketing IA", icon: "❖" },
  { name: "Juriste IA", icon: "§" },
  { name: "Comptable IA", icon: "∑" },
  { name: "Dev Full-Stack IA", icon: "⌘" },
  { name: "Recruteur IA", icon: "◇" },
  { name: "Agent Support IA", icon: "✦" },
  { name: "Copywriter IA", icon: "✎" },
];

type LogoFn = (props: { className?: string }) => React.ReactElement;
const TOOLS: { name: string; Logo: LogoFn; connected: boolean }[] = [
  { name: "Google Search Console", Logo: GoogleLogo, connected: false },
  { name: "Google Analytics", Logo: GoogleLogo, connected: false },
  { name: "Slack", Logo: SlackLogo, connected: false },
  { name: "Notion", Logo: NotionLogo, connected: false },
  { name: "Gmail", Logo: GmailLogo, connected: false },
];

const SECTEURS = [
  "E-commerce",
  "Conseil / Consulting",
  "Agence marketing",
  "Immobilier",
  "Finance / Comptabilité",
  "Juridique",
  "Technologie / SaaS",
  "Santé",
  "Éducation",
  "Autre",
];
const TAILLES = [
  "Indépendant / Freelance",
  "2 à 10",
  "11 à 50",
  "51 à 200",
  "Plus de 200",
];
const SOURCES = [
  "Recherche Google",
  "Réseaux sociaux",
  "Bouche-à-oreille",
  "Publicité en ligne",
  "Article ou blog",
  "Autre",
];

const PRO_BENEFITS = [
  "Agents illimités",
  "Connecteurs avancés",
  "Rapports automatiques",
  "Support prioritaire",
];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function initials(p: Pick<Profile, "prenom" | "nom">, email?: string | null) {
  const combo = `${p.prenom?.[0] ?? ""}${p.nom?.[0] ?? ""}`.trim();
  if (combo) return combo.toUpperCase();
  return (email?.slice(0, 2) ?? "U").toUpperCase();
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

type Toast = { key: number; type: "success" | "error"; msg: string };

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function ComptePage() {
  const router = useRouter();
  const { loading, user, profile } = useAuth();

  const [tab, setTab] = useState<TabId>("agents");
  const [overrides, setOverrides] = useState<Partial<Profile>>({});
  const [toast, setToast] = useState<Toast | null>(null);
  const [modalTool, setModalTool] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/connexion?redirect=/compte");
    } else if (profile && profile.role !== "utilisateur") {
      router.replace("/createur");
    }
  }, [loading, user, profile, router]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  if (loading || !user || (profile && profile.role !== "utilisateur")) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-beige text-muted">
        Chargement…
      </div>
    );
  }

  const current = { ...profile, ...overrides } as Profile;
  const name = displayName(current, user.email);

  function showToast(type: Toast["type"], msg: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ key: Date.now(), type, msg });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-beige text-ink">
      <DashboardTopBar name={name} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8 sm:py-10">
        {/* ===== Bandeau de bienvenue ===== */}
        <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-forest text-lg font-bold text-white shadow-[0_2px_10px_rgba(61,107,79,0.35)]">
              {initials(current, user.email)}
            </span>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  Bonjour, {name}
                </h1>
                <span className="rounded-full bg-forest-soft px-2.5 py-0.5 text-xs font-semibold text-forest-dark">
                  Utilisateur
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">
                Membre depuis {memberSince(current.created_at)}
              </p>
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

        {/* ===== Contenu de l'onglet (fade-in) ===== */}
        <div key={tab} className="msg-in mt-8">
          {tab === "agents" && <TabAgents />}
          {tab === "outils" && (
            <TabOutils onConnect={(name) => setModalTool(name)} />
          )}
          {tab === "abonnement" && <TabAbonnement />}
          {tab === "profil" && (
            <TabProfil
              current={current}
              email={user.email ?? ""}
              onSaved={(patch) => {
                setOverrides((prev) => ({ ...prev, ...patch }));
                showToast("success", "Profil mis à jour ✓");
              }}
              onError={() =>
                showToast("error", "Échec de la mise à jour. Veuillez réessayer.")
              }
              onToast={showToast}
              userId={user.id}
              onDeleted={async () => {
                await signOut();
                router.replace("/");
                router.refresh();
              }}
            />
          )}
        </div>
      </main>

      {/* ===== Modal "Disponible prochainement" ===== */}
      {modalTool && (
        <ComingSoonModal tool={modalTool} onClose={() => setModalTool(null)} />
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

function TabAgents() {
  return (
    <div className="grid gap-6">
      {/* Agent SEO actif */}
      <section className="card p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-forest-soft text-2xl text-forest">
              ◆
            </span>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-semibold tracking-tight text-ink">
                  Agent SEO
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-soft px-2.5 py-0.5 text-xs font-semibold text-forest-dark">
                  <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                  Actif
                </span>
              </div>
              <p className="mt-1.5 max-w-md text-sm leading-6 text-muted">
                Audite votre site, trouve les mots-clés gagnants et rédige des
                contenus optimisés pour grimper dans Google.
              </p>
            </div>
          </div>
          <Link
            href="/agents/seo/chat"
            className="btn-primary group inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold"
          >
            Ouvrir le chat
            <span className="btn-arrow" aria-hidden>
              →
            </span>
          </Link>
        </div>

        {/* Statistiques */}
        <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          {[
            { label: "Conversations", value: "12" },
            { label: "Dernier message", value: "Hier, 14h32" },
            { label: "Activé le", value: "1er juillet 2026" },
          ].map((s) => (
            <div key={s.label} className="bg-white px-5 py-4 text-center">
              <dt className="label text-muted">{s.label}</dt>
              <dd className="mt-1 font-semibold text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Agents disponibles */}
      <section className="card p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Agents disponibles
        </h2>
        <p className="mt-1 text-sm text-muted">
          D&apos;autres métiers IA arrivent bientôt sur OperIA.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OTHER_AGENTS.map((a) => (
            <div
              key={a.name}
              className="flex h-full flex-col rounded-2xl border border-line bg-beige/50 p-5"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-beige-deep text-xl text-muted">
                  {a.icon}
                </span>
                <span className="rounded-full bg-beige-deep px-2.5 py-1 text-[0.68rem] font-semibold text-muted">
                  Bientôt disponible
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-ink">{a.name}</h3>
              <button
                type="button"
                disabled
                className="mt-4 w-full cursor-not-allowed rounded-full bg-beige-deep px-4 py-2 text-sm font-semibold text-muted/70"
              >
                Rejoindre la liste d&apos;attente
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ================================================================== */
/* Onglet — Mes outils                                                 */
/* ================================================================== */

function TabOutils({ onConnect }: { onConnect: (name: string) => void }) {
  return (
    <div className="grid gap-6">
      <section className="card p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Outils connectés
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          Connectez vos outils pour que l&apos;Agent SEO accède à vos vraies
          données et génère des rapports personnalisés.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white">
                  <tool.Logo className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-ink">
                    {tool.name}
                  </div>
                  <div
                    className={`mt-0.5 flex items-center gap-1.5 text-xs ${
                      tool.connected ? "text-forest" : "text-muted"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        tool.connected ? "bg-forest" : "bg-muted/40"
                      }`}
                    />
                    {tool.connected ? "Connecté" : "Non connecté"}
                  </div>
                </div>
              </div>
              {!tool.connected && (
                <button
                  type="button"
                  onClick={() => onConnect(tool.name)}
                  className="btn-secondary shrink-0 rounded-full px-4 py-2 text-sm font-semibold"
                >
                  Connecter
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ================================================================== */
/* Onglet — Mon abonnement                                             */
/* ================================================================== */

function TabAbonnement() {
  return (
    <div className="grid gap-6">
      {/* Plan actuel */}
      <section className="card p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="label text-muted">Plan actuel</p>
            <div className="mt-1.5 flex items-center gap-2.5">
              <span className="font-display text-2xl font-bold text-ink">
                Starter
              </span>
              <span className="rounded-full bg-forest-soft px-2.5 py-0.5 text-xs font-semibold text-forest-dark">
                Gratuit
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Passer au Pro */}
      <section className="card relative overflow-hidden p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-forest/[0.06] blur-3xl"
        />
        <div className="relative">
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            Passer au Pro
          </h2>
          <p className="mt-1 text-sm text-muted">
            Débloquez toute la puissance d&apos;OperIA.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {PRO_BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-sm text-ink">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-soft text-xs text-forest">
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
          <Link
            href="/tarifs"
            className="btn-primary mt-7 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
          >
            Passer au Pro — 29€/mois
          </Link>
        </div>
      </section>

      {/* Historique des transactions */}
      <section className="card p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Historique des transactions
        </h2>
        <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-line bg-beige/50 px-6 py-10 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-beige-deep text-xl text-muted">
            ⧉
          </span>
          <p className="mt-3 text-sm text-muted">
            Aucune transaction pour le moment.
          </p>
        </div>
      </section>

      {/* Essai gratuit */}
      <section className="card border-forest/20 bg-forest-soft/40 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-xl text-forest shadow-sm">
            ✦
          </span>
          <div>
            <h2 className="font-semibold tracking-tight text-ink">
              Essai gratuit
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Vous avez 7 jours d&apos;essai gratuit sur chaque agent.
              Profitez-en&nbsp;!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ================================================================== */
/* Onglet — Mon profil                                                 */
/* ================================================================== */

type ProfileFormKey =
  | "prenom"
  | "nom"
  | "entreprise"
  | "secteur"
  | "taille_entreprise"
  | "source";

function TabProfil({
  current,
  email,
  userId,
  onSaved,
  onError,
  onToast,
  onDeleted,
}: {
  current: Profile;
  email: string;
  userId: string;
  onSaved: (patch: Partial<Profile>) => void;
  onError: () => void;
  onToast: (type: "success" | "error", msg: string) => void;
  onDeleted: () => void;
}) {
  const [edits, setEdits] = useState<Partial<Record<ProfileFormKey, string>>>(
    {},
  );
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const val = (k: ProfileFormKey) => edits[k] ?? current[k] ?? "";
  const setField = (k: ProfileFormKey, v: string) =>
    setEdits((e) => ({ ...e, [k]: v }));

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    const patch: Partial<Profile> = {
      prenom: val("prenom"),
      nom: val("nom"),
      entreprise: val("entreprise"),
      secteur: val("secteur"),
      taille_entreprise: val("taille_entreprise"),
      source: val("source"),
    };
    const { error } = await updateProfile(userId, patch);
    setSaving(false);
    if (error) {
      onError();
      return;
    }
    setEdits({});
    onSaved(patch);
  }

  async function handlePasswordReset() {
    if (resetting) return;
    setResetting(true);
    // Auth locale (Postgres) sans service d'email : réinitialisation par lien
    // indisponible. Voir docs/spécifications pour rebrancher un service mail.
    onToast(
      "error",
      "Réinitialisation par email indisponible dans cette configuration.",
    );
    setResetting(false);
  }

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    // La suppression définitive du compte nécessite un traitement serveur
    // (clé service_role). On enregistre la demande et on déconnecte l'utilisateur.
    onToast("success", "Demande de suppression enregistrée.");
    onDeleted();
  }

  return (
    <div className="grid gap-6">
      {/* Formulaire d'informations */}
      <section className="card p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Mes informations
        </h2>
        <form onSubmit={handleSave} className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="prenom">Prénom</Label>
            <input
              id="prenom"
              type="text"
              value={val("prenom")}
              onChange={(e) => setField("prenom", e.target.value)}
              placeholder="Camille"
              className={inputClass}
            />
          </div>
          <div>
            <Label htmlFor="nom">Nom</Label>
            <input
              id="nom"
              type="text"
              value={val("nom")}
              onChange={(e) => setField("nom", e.target.value)}
              placeholder="Laurent"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="email" hint="(non modifiable)">
              Email
            </Label>
            <input
              id="email"
              type="email"
              value={email}
              disabled
              className={`${inputClass} cursor-not-allowed bg-beige-deep text-muted`}
            />
          </div>
          <div>
            <Label htmlFor="entreprise">Entreprise</Label>
            <input
              id="entreprise"
              type="text"
              value={val("entreprise")}
              onChange={(e) => setField("entreprise", e.target.value)}
              placeholder="Nyx Studio"
              className={inputClass}
            />
          </div>
          <div>
            <Label htmlFor="secteur">Secteur</Label>
            <Select
              id="secteur"
              value={val("secteur")}
              onChange={(v) => setField("secteur", v)}
              placeholder="Choisir un secteur"
              options={SECTEURS}
            />
          </div>
          <div>
            <Label htmlFor="taille">Taille de l&apos;entreprise</Label>
            <Select
              id="taille"
              value={val("taille_entreprise")}
              onChange={(v) => setField("taille_entreprise", v)}
              placeholder="Choisir une taille"
              options={TAILLES}
            />
          </div>
          <div>
            <Label htmlFor="source">Comment avez-vous connu OperIA&nbsp;?</Label>
            <Select
              id="source"
              value={val("source")}
              onChange={(v) => setField("source", v)}
              placeholder="Choisir une réponse"
              options={SOURCES}
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary rounded-full px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
            >
              {saving ? "Enregistrement…" : "Sauvegarder"}
            </button>
          </div>
        </form>
      </section>

      {/* Mot de passe */}
      <section className="card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              Changer de mot de passe
            </h2>
            <p className="mt-1 text-sm text-muted">
              Compte : {email}. Réinitialisation par email bientôt disponible.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePasswordReset}
            disabled={resetting}
            className="btn-secondary shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-70"
          >
            {resetting ? "Envoi…" : "Envoyer le lien"}
          </button>
        </div>
      </section>

      {/* Suppression du compte */}
      <section className="card border-red-200 p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-red-700">
          Supprimer mon compte
        </h2>
        {!confirmDelete ? (
          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              Cette action est définitive et supprimera toutes vos données.
            </p>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="shrink-0 rounded-full border border-red-300 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
            >
              Supprimer mon compte
            </button>
          </div>
        ) : (
          <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              Êtes-vous sûr&nbsp;? Cette action est irréversible.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
              >
                {deleting ? "Suppression…" : "Oui, supprimer définitivement"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="btn-secondary rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* ================================================================== */
/* Modal "Disponible prochainement"                                    */
/* ================================================================== */

function ComingSoonModal({
  tool,
  onClose,
}: {
  tool: string;
  onClose: () => void;
}) {
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
          Disponible prochainement
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          Nous travaillons sur l&apos;intégration <strong>{tool}</strong>. Elle
          sera bientôt disponible pour connecter vos vraies données.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="btn-primary mt-6 w-full rounded-full px-6 py-2.5 text-sm font-semibold"
        >
          J&apos;ai compris
        </button>
      </div>
    </div>
  );
}
