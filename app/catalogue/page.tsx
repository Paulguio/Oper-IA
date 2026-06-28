import type { Metadata } from "next";
import CatalogueGrid from "../components/CatalogueGrid";
import Footer from "../components/Footer";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "Catalogue des agents — OperIA",
  description:
    "Découvrez les métiers IA disponibles sur OperIA : SEO, marketing, juridique, finance, tech, RH et support.",
};

export default function CataloguePage() {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-beige text-ink">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        {/* Page hero */}
        <section className="relative pt-20 pb-12 text-center sm:pt-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-6 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-forest/10 blur-3xl"
          />
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-forest">
            Place de marché
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Le catalogue des métiers IA
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-muted">
            Choisissez un agent, connectez vos outils, et laissez-le travailler
            pour vous. De nouveaux métiers arrivent chaque mois.
          </p>
        </section>

        {/* Catalogue */}
        <section className="pb-28">
          <CatalogueGrid />
        </section>
      </main>

      <Footer />
    </div>
  );
}
