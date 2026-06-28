"use client";

import { useMemo, useState } from "react";

type Agent = {
  name: string;
  price: number;
  category: string;
  icon: string;
  description: string;
  active: boolean;
};

const AGENTS: Agent[] = [
  {
    name: "Agent SEO",
    price: 49,
    category: "Marketing",
    icon: "◆",
    description:
      "Audite votre site, trouve les mots-clés gagnants et rédige des contenus optimisés pour grimper dans Google.",
    active: true,
  },
  {
    name: "Directeur Marketing IA",
    price: 79,
    category: "Marketing",
    icon: "❖",
    description:
      "Pilote votre stratégie d'acquisition, planifie les campagnes et analyse vos performances en continu.",
    active: false,
  },
  {
    name: "Juriste IA",
    price: 99,
    category: "Juridique",
    icon: "§",
    description:
      "Rédige et relit vos contrats, repère les clauses à risque et répond à vos questions juridiques.",
    active: false,
  },
  {
    name: "Comptable IA",
    price: 49,
    category: "Finance",
    icon: "∑",
    description:
      "Catégorise vos dépenses, prépare vos déclarations et garde vos comptes à jour automatiquement.",
    active: false,
  },
  {
    name: "Dev Full-Stack IA",
    price: 89,
    category: "Tech",
    icon: "⌘",
    description:
      "Écrit, teste et déploie du code. De la maquette à la mise en production, sans quitter votre stack.",
    active: false,
  },
  {
    name: "Recruteur IA",
    price: 59,
    category: "RH",
    icon: "◇",
    description:
      "Trie les candidatures, présélectionne les meilleurs profils et organise vos entretiens.",
    active: false,
  },
  {
    name: "Agent Support IA",
    price: 35,
    category: "Support",
    icon: "✦",
    description:
      "Répond à vos clients 24/7, résout les demandes courantes et escalade ce qui mérite un humain.",
    active: false,
  },
  {
    name: "Copywriter IA",
    price: 29,
    category: "Marketing",
    icon: "✎",
    description:
      "Produit des accroches, des emails et des pages de vente qui convertissent, dans votre ton de marque.",
    active: false,
  },
];

const CATEGORIES = [
  "Tous",
  "Marketing",
  "Juridique",
  "Finance",
  "Tech",
  "RH",
  "Support",
];

export default function CatalogueGrid() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tous");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AGENTS.filter((agent) => {
      const matchesCategory =
        category === "Tous" || agent.category === category;
      const matchesQuery =
        q === "" ||
        agent.name.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div>
      {/* Search + filters */}
      <div className="flex flex-col gap-5">
        <div className="relative">
          <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted">
            ⌕
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un agent…"
            aria-label="Rechercher un agent"
            className="h-13 w-full rounded-full border border-black/10 bg-white py-3.5 pl-12 pr-5 text-base text-ink shadow-sm outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/15"
          />
        </div>

        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                category === cat
                  ? "bg-forest text-white shadow-sm"
                  : "border border-black/10 bg-white text-muted hover:border-forest/30 hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="mt-8 text-sm text-muted">
        {filtered.length} agent{filtered.length > 1 ? "s" : ""}
        {category !== "Tous" ? ` · ${category}` : ""}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-black/10 bg-white/50 px-6 py-20 text-center">
          <p className="text-lg font-medium text-ink">Aucun agent trouvé</p>
          <p className="mt-2 text-muted">
            Essayez un autre terme ou changez de catégorie.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((agent) => (
            <AgentCard key={agent.name} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div
      className={`group flex h-full flex-col rounded-3xl border p-7 transition-all duration-300 ${
        agent.active
          ? "border-black/5 bg-white shadow-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-forest-darker/10"
          : "border-black/5 bg-white/60"
      }`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`flex h-13 w-13 items-center justify-center rounded-2xl text-2xl transition-colors ${
            agent.active
              ? "bg-forest-soft text-forest group-hover:bg-forest group-hover:text-white"
              : "bg-beige-deep text-muted"
          }`}
        >
          {agent.icon}
        </span>
        {agent.active ? (
          <span className="rounded-full bg-forest-soft px-3 py-1 text-xs font-semibold text-forest-dark">
            Disponible
          </span>
        ) : (
          <span className="rounded-full bg-beige-deep px-3 py-1 text-xs font-semibold text-muted">
            Bientôt disponible
          </span>
        )}
      </div>

      <h3 className="mt-6 text-lg font-semibold text-ink">{agent.name}</h3>
      <span className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">
        {agent.category}
      </span>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted">
        {agent.description}
      </p>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-xl font-bold text-ink">
          {agent.price}€
          <span className="text-sm font-normal text-muted">/mois</span>
        </span>
        {agent.active ? (
          <button
            type="button"
            className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-forest-dark hover:shadow-md active:scale-[0.98]"
          >
            Découvrir
          </button>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="cursor-not-allowed rounded-full bg-beige-deep px-5 py-2.5 text-sm font-semibold text-muted/70"
          >
            Bientôt
          </button>
        )}
      </div>
    </div>
  );
}
