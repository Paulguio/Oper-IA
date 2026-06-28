import type { Metadata } from "next";
import Link from "next/link";
import AgentTabs from "../../components/AgentTabs";
import {
  GmailLogo,
  GoogleLogo,
  NotionLogo,
  SlackLogo,
} from "../../components/BrandLogos";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export const metadata: Metadata = {
  title: "Agent SEO — OperIA",
  description:
    "L'Agent SEO d'OperIA audite votre site, trouve les mots-clés gagnants et optimise vos contenus pour Google. 49€/mois, essai 7 jours gratuit.",
};

const tags = ["SEO", "Marketing", "Analytics"];

const stats = [
  { value: "4,9★", label: "note moyenne" },
  { value: "840", label: "utilisateurs" },
  { value: "98%", label: "taux de succès" },
  { value: "v2.4", label: "version" },
];

const benefits = [
  "Accès illimité à l'agent",
  "Mises à jour incluses",
  "Connexion à tous vos outils",
  "Rapports hebdomadaires",
  "Support prioritaire",
];

const compatibility = [
  { name: "Google Search Console", Logo: GoogleLogo },
  { name: "Google Analytics", Logo: GoogleLogo },
  { name: "Slack", Logo: SlackLogo },
  { name: "Notion", Logo: NotionLogo },
  { name: "Gmail", Logo: GmailLogo },
];

export default function AgentSeoPage() {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-beige text-ink">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        {/* Breadcrumb */}
        <nav className="pt-8 text-sm text-muted">
          <Link href="/catalogue" className="transition-colors hover:text-ink">
            Catalogue
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Agent SEO</span>
        </nav>

        {/* Agent header */}
        <section className="relative pt-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-2 right-10 -z-10 h-56 w-56 rounded-full bg-forest/10 blur-3xl"
          />
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-forest text-4xl text-white shadow-lg shadow-forest/25">
              ◆
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Agent SEO
              </h1>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-muted">
                Audite votre site, trouve les mots-clés gagnants et rédige des
                contenus optimisés pour grimper dans les résultats Google — en
                pilote automatique.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-forest/20 bg-forest-soft px-3 py-1 text-xs font-semibold text-forest-dark"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-black/5 bg-black/5 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center bg-white px-4 py-8 text-center"
              >
                <span className="text-3xl font-bold tracking-tight text-forest">
                  {s.value}
                </span>
                <span className="mt-1 text-sm text-muted">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Main + sidebar */}
        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            <AgentTabs />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-ink">
                    49€
                  </span>
                  <span className="text-muted">/mois</span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  Sans engagement · résiliable à tout moment.
                </p>

                <button
                  type="button"
                  className="mt-6 h-12 w-full rounded-full bg-forest text-base font-semibold text-white shadow-lg shadow-forest/25 transition-all hover:bg-forest-dark hover:shadow-forest/40 active:scale-[0.98]"
                >
                  S&apos;abonner
                </button>
                <button
                  type="button"
                  className="mt-3 h-12 w-full rounded-full border border-forest/25 bg-white text-base font-semibold text-forest-dark transition-all hover:bg-forest-soft active:scale-[0.98]"
                >
                  Essai 7 jours gratuits
                </button>

                <ul className="mt-7 space-y-3 border-t border-black/5 pt-6">
                  {benefits.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-sm text-ink"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-soft text-xs text-forest">
                        ✓
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Creator */}
              <div className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Créateur
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-base font-bold text-white">
                    SP
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-ink">
                      Studio Paul
                      <span className="text-forest" title="Créateur vérifié">
                        ✓
                      </span>
                    </div>
                    <div className="text-xs text-muted">
                      Créateur vérifié · 4 agents publiés
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">
                  Spécialiste de l&apos;acquisition organique, Studio Paul conçoit
                  des agents IA dédiés à la croissance des PME.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Compatibility */}
        <section className="mt-16 pb-28">
          <h2 className="text-2xl font-bold tracking-tight">Compatibilité</h2>
          <p className="mt-2 text-muted">
            L&apos;Agent SEO se connecte en un clic aux outils que vous utilisez
            déjà.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {compatibility.map(({ name, Logo }) => (
              <div
                key={name}
                className="flex flex-col items-center gap-3 rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <Logo className="h-8 w-8" />
                <span className="text-sm font-medium text-ink">{name}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
