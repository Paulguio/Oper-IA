import type { Metadata } from "next";
import Link from "next/link";
import Faq, { type FaqItem } from "../components/Faq";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Fonctionnement — OperIA",
  description:
    "Découvrez comment OperIA fonctionne en trois étapes : choisissez un agent, connectez vos outils, laissez-le travailler pour vous.",
};

const steps = [
  {
    n: "01",
    title: "Choisissez un agent",
    description:
      "Parcourez la place de marché et sélectionnez le métier IA adapté à votre besoin, du support client à l'analyse de données. Chaque agent est prêt à l'emploi.",
  },
  {
    n: "02",
    title: "Connectez vos outils",
    description:
      "Reliez Google, Slack, Notion ou Gmail en un clic. L'agent accède en toute sécurité aux outils que vous utilisez déjà, sans configuration technique.",
  },
  {
    n: "03",
    title: "L'agent travaille pour vous",
    description:
      "Laissez-le opérer en autonomie. Suivez ses résultats, ajustez ses priorités et gagnez plusieurs heures chaque semaine.",
  },
];

const faqItems: FaqItem[] = [
  {
    question: "Faut-il savoir coder pour utiliser OperIA ?",
    answer:
      "Non, aucune compétence technique n'est requise. Vous choisissez un agent, connectez vos outils en quelques clics, et il se met au travail immédiatement.",
  },
  {
    question: "Combien de temps faut-il pour mettre un agent en place ?",
    answer:
      "Quelques minutes. La sélection de l'agent et la connexion de vos outils se font directement depuis votre tableau de bord, sans installation.",
  },
  {
    question: "Mes données sont-elles en sécurité ?",
    answer:
      "Oui. Vos données sont hébergées et traitées dans le respect du RGPD, avec un contrôle fin des accès. Vos agents travaillent dans un cadre maîtrisé.",
  },
  {
    question: "Puis-je connecter mes propres outils ?",
    answer:
      "Absolument. OperIA s'intègre nativement à Google, Slack, Notion et Gmail, et de nouvelles intégrations sont ajoutées chaque mois.",
  },
];

export default function FonctionnementPage() {
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
            Comment ça marche
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Trois étapes, et c&apos;est parti
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-muted">
            OperIA rend les métiers IA accessibles à tous. Pas de code, pas de
            friction — juste des résultats.
          </p>
        </section>

        {/* Steps */}
        <section className="pb-28">
          <div className="relative grid gap-10 sm:grid-cols-3">
            <div
              aria-hidden
              className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-7 hidden border-t-2 border-dashed border-forest/25 sm:block"
            />
            {steps.map((step, i) => (
              <Reveal key={step.n} delay={i * 140} className="relative">
                <div className="flex flex-col items-center text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-forest/20 bg-beige text-lg font-bold text-forest shadow-sm">
                    {step.n}
                  </span>
                  <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 max-w-xs leading-7 text-muted">
                    {step.description}
                  </p>
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
              Tout ce que vous devez savoir
            </h2>
          </Reveal>
          <div className="mt-12">
            <Faq items={faqItems} />
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/catalogue"
              className="inline-flex h-13 items-center justify-center rounded-full bg-forest px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-forest/25 transition-all hover:bg-forest-dark hover:shadow-forest/40 active:scale-[0.98]"
            >
              Explorer le catalogue
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
