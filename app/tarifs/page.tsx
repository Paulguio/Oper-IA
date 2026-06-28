import type { Metadata } from "next";
import Link from "next/link";
import Faq, { type FaqItem } from "../components/Faq";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Tarifs — OperIA",
  description:
    "Choisissez le plan OperIA adapté à vous : Starter gratuit, Pro à 29€/mois ou Entreprise sur devis. Sans engagement.",
};

type Plan = {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "Gratuit",
    description: "Pour découvrir OperIA et lancer votre premier agent.",
    features: [
      "1 agent actif",
      "100 actions par mois",
      "Connexions de base",
      "Support communautaire",
    ],
    cta: "Commencer gratuitement",
    href: "/inscription",
  },
  {
    name: "Pro",
    price: "29€",
    period: "/mois",
    description: "Pour les indépendants et équipes qui veulent passer à la vitesse supérieure.",
    features: [
      "Agents illimités",
      "Actions illimitées",
      "Toutes les connexions (Google, Slack, Notion, Gmail…)",
      "Rapports avancés",
      "Support prioritaire",
    ],
    cta: "Choisir Pro",
    href: "/inscription",
    featured: true,
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    description: "Pour les organisations qui déploient l'IA à grande échelle.",
    features: [
      "Tout le plan Pro",
      "SSO et gestion des accès",
      "SLA et conformité RGPD",
      "Accompagnement dédié",
      "Facturation centralisée",
    ],
    cta: "Nous contacter",
    href: "/contact",
  },
];

const faqItems: FaqItem[] = [
  {
    question: "Puis-je changer de plan à tout moment ?",
    answer:
      "Oui. Vous pouvez passer au plan supérieur ou revenir en arrière quand vous le souhaitez, directement depuis votre tableau de bord. Les changements prennent effet immédiatement.",
  },
  {
    question: "Le plan Starter est-il vraiment gratuit ?",
    answer:
      "Oui, le plan Starter est gratuit et sans limite de durée. Aucune carte bancaire n'est demandée pour commencer.",
  },
  {
    question: "Y a-t-il un engagement de durée ?",
    answer:
      "Aucun. Les plans sont sans engagement et résiliables à tout moment. Vous n'êtes facturé que pour le mois en cours.",
  },
  {
    question: "Comment fonctionne la facturation Entreprise ?",
    answer:
      "Le plan Entreprise est établi sur devis, en fonction de vos besoins et du nombre d'utilisateurs. La facturation est centralisée et personnalisée. Contactez-nous pour une proposition.",
  },
];

export default function TarifsPage() {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-beige text-ink">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        {/* Hero */}
        <section className="relative pt-20 pb-16 text-center sm:pt-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-forest/10 blur-3xl"
          />
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-forest">
            Tarifs
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Un tarif simple, sans surprise
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-muted">
            Commencez gratuitement, évoluez quand vous êtes prêt. Sans
            engagement, résiliable à tout moment.
          </p>
        </section>

        {/* Plans */}
        <section className="pb-28">
          <div className="grid items-start gap-6 lg:grid-cols-3">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 120}>
                <div
                  className={`flex h-full flex-col rounded-3xl p-8 ${
                    plan.featured
                      ? "border-2 border-forest bg-white shadow-xl shadow-forest-darker/15 lg:-mt-4 lg:pb-12"
                      : "border border-black/5 bg-white shadow-sm"
                  }`}
                >
                  {plan.featured && (
                    <span className="mb-4 inline-flex w-fit rounded-full bg-forest px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                      Le plus populaire
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-ink">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted">{plan.period}</span>
                    )}
                  </div>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-muted">
                    {plan.description}
                  </p>

                  <Link
                    href={plan.href}
                    className={`mt-6 flex h-12 items-center justify-center rounded-full px-6 text-base font-semibold transition-all active:scale-[0.98] ${
                      plan.featured
                        ? "bg-forest text-white shadow-lg shadow-forest/25 hover:bg-forest-dark hover:shadow-forest/40"
                        : "border border-forest/25 bg-white text-forest-dark hover:bg-forest-soft"
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="mt-8 space-y-3 border-t border-black/5 pt-6">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-ink"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-soft text-xs text-forest">
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-28">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-forest">
              Questions fréquentes
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Les tarifs en clair
            </h2>
          </Reveal>
          <div className="mt-12">
            <Faq items={faqItems} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
