"use client";

import { useState } from "react";

const TABS = [
  { id: "presentation", label: "Présentation" },
  { id: "demo", label: "Démo" },
  { id: "avis", label: "Avis" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const FEATURES = [
  {
    icon: "◆",
    title: "Audit technique complet",
    description:
      "Analyse plus de 200 critères : vitesse, balises, données structurées, erreurs d'indexation.",
  },
  {
    icon: "◈",
    title: "Recherche de mots-clés",
    description:
      "Identifie les requêtes à fort potentiel et le volume de recherche dans votre secteur.",
  },
  {
    icon: "❖",
    title: "Optimisation on-page",
    description:
      "Réécrit titres, méta-descriptions et contenus pour maximiser votre visibilité.",
  },
  {
    icon: "◇",
    title: "Analyse de la concurrence",
    description:
      "Compare votre positionnement à celui de vos concurrents et repère leurs failles.",
  },
  {
    icon: "✦",
    title: "Suivi de positionnement",
    description:
      "Surveille vos classements Google au quotidien et vous alerte des variations.",
  },
  {
    icon: "✎",
    title: "Rapports automatisés",
    description:
      "Génère chaque semaine un rapport clair, prêt à partager avec votre équipe.",
  },
];

const REVIEWS = [
  {
    initials: "ML",
    name: "Marie Lefort",
    role: "Fondatrice, Atelier Margaux",
    rating: 5,
    text: "En deux mois, on est passés de la page 3 à la première position sur nos mots-clés principaux. L'agent fait le travail d'une agence à une fraction du prix.",
  },
  {
    initials: "TR",
    name: "Thomas Roy",
    role: "Responsable e-commerce, Velora",
    rating: 5,
    text: "Les audits sont d'une précision incroyable et les recommandations sont directement actionnables. Le trafic organique a bondi de 60 %.",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-forest" aria-label={`${rating} étoiles sur 5`}>
      {"★".repeat(rating)}
      <span className="text-forest/25">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

const DEMO_CHECKS = [
  { label: "Balise title", status: "ok", note: "Optimisée" },
  { label: "Méta-description", status: "warn", note: "À améliorer" },
  { label: "Vitesse de chargement", status: "ok", note: "Bonne" },
  { label: "Compatibilité mobile", status: "ok", note: "Optimale" },
  { label: "Données structurées", status: "error", note: "Manquantes" },
  { label: "Maillage interne", status: "ok", note: "Correct" },
] as const;

const STATUS_STYLE = {
  ok: { dot: "bg-forest", badge: "bg-forest-soft text-forest-dark", icon: "✓" },
  warn: {
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700",
    icon: "!",
  },
  error: { dot: "bg-red-400", badge: "bg-red-50 text-red-700", icon: "✕" },
} as const;

export default function AgentTabs() {
  const [active, setActive] = useState<TabId>("presentation");

  return (
    <div>
      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Sections de l'agent"
        className="flex gap-1.5 rounded-full border border-black/5 bg-white p-1.5 shadow-sm"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
              active === tab.id
                ? "bg-forest text-white shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {active === "presentation" && <Presentation />}
        {active === "demo" && <Demo />}
        {active === "avis" && <Avis />}
      </div>
    </div>
  );
}

function Presentation() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {FEATURES.map((f) => (
        <div
          key={f.title}
          className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-soft text-xl text-forest">
            {f.icon}
          </span>
          <h3 className="mt-4 font-semibold text-ink">{f.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{f.description}</p>
        </div>
      ))}
    </div>
  );
}

function Demo() {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ url: string; score: number } | null>(
    null,
  );

  function analyze(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!url.trim() || analyzing) return;
    setAnalyzing(true);
    setResult(null);
    // Analyse fictive : score pseudo-déterministe dérivé de l'URL.
    const score = 74 + (url.trim().length % 23);
    setTimeout(() => {
      setResult({ url: url.trim(), score });
      setAnalyzing(false);
    }, 900);
  }

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm sm:p-8">
      <h3 className="text-lg font-semibold text-ink">
        Analysez un site en direct
      </h3>
      <p className="mt-1.5 text-sm text-muted">
        Entrez l&apos;URL d&apos;une page pour obtenir un aperçu de
        l&apos;analyse SEO de l&apos;agent.
      </p>

      <form onSubmit={analyze} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://votre-site.com"
          aria-label="URL à analyser"
          className="h-12 flex-1 rounded-full border border-black/10 bg-beige px-5 text-base text-ink outline-none transition focus:border-forest focus:bg-white focus:ring-4 focus:ring-forest/15"
        />
        <button
          type="submit"
          disabled={analyzing}
          className="h-12 rounded-full bg-forest px-7 text-base font-semibold text-white shadow-sm transition-all hover:bg-forest-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {analyzing ? "Analyse…" : "Analyser"}
        </button>
      </form>

      {analyzing && (
        <div className="mt-7 animate-pulse text-sm text-muted">
          Inspection des balises, de la vitesse et de l&apos;indexation…
        </div>
      )}

      {result && (
        <div className="mt-7">
          <div className="flex items-center gap-5 rounded-2xl bg-forest-soft p-5">
            <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full bg-white shadow-sm">
              <span className="text-2xl font-bold text-forest">
                {result.score}
              </span>
              <span className="text-[10px] font-medium text-muted">/ 100</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-forest-dark">
                Score SEO global
              </p>
              <p className="mt-1 break-all text-sm text-muted">{result.url}</p>
            </div>
          </div>

          <ul className="mt-5 divide-y divide-black/5 rounded-2xl border border-black/5">
            {DEMO_CHECKS.map((check) => {
              const s = STATUS_STYLE[check.status];
              return (
                <li
                  key={check.label}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <span className="flex items-center gap-3 text-sm text-ink">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white ${s.dot}`}
                    >
                      {s.icon}
                    </span>
                    {check.label}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${s.badge}`}
                  >
                    {check.note}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-center text-xs text-muted">
            Aperçu fictif · l&apos;analyse complète est disponible après
            abonnement.
          </p>
        </div>
      )}
    </div>
  );
}

function Avis() {
  return (
    <div>
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-black/5 bg-white p-7 text-center shadow-sm sm:flex-row sm:text-left">
        <div className="flex flex-col items-center sm:border-r sm:border-black/5 sm:pr-8">
          <span className="text-5xl font-bold text-forest">4,9</span>
          <Stars rating={5} />
          <span className="mt-1 text-xs text-muted">840 avis</span>
        </div>
        <p className="text-muted">
          Les utilisateurs plébiscitent la précision des audits et la qualité
          des recommandations. Voici quelques retours récents.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {REVIEWS.map((review) => (
          <div
            key={review.name}
            className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">
                {review.initials}
              </span>
              <div>
                <div className="font-semibold text-ink">{review.name}</div>
                <div className="text-xs text-muted">{review.role}</div>
              </div>
            </div>
            <div className="mt-3">
              <Stars rating={review.rating} />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
