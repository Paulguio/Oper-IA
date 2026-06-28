import WaitlistForm from "./components/WaitlistForm";

const features = [
  {
    icon: "◆",
    title: "Assemblez vos agents",
    description:
      "Composez des métiers IA comme des briques : connectez les compétences, orchestrez les tâches, déployez en quelques minutes.",
  },
  {
    icon: "◈",
    title: "Une place de marché",
    description:
      "Créateurs et entreprises se rencontrent. Publiez vos modules, trouvez les talents IA dont votre activité a besoin.",
  },
  {
    icon: "❖",
    title: "Prêt pour l'échelle",
    description:
      "Sécurité, suivi et intégrations pensés pour la production. De la première idée jusqu'au déploiement à grande échelle.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-beige text-ink">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest text-lg font-bold text-white">
            O
          </span>
          <span className="text-xl font-semibold tracking-tight">
            Oper<span className="text-forest">IA</span>
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted sm:flex">
          <a href="#features" className="transition-colors hover:text-ink">
            Fonctionnalités
          </a>
          <a href="#waitlist" className="transition-colors hover:text-ink">
            Liste d&apos;attente
          </a>
        </nav>
        <a
          href="#waitlist"
          className="rounded-full bg-forest px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
        >
          Rejoindre
        </a>
      </header>

      {/* Hero */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6">
        <section className="flex flex-col items-center pt-20 pb-24 text-center sm:pt-28">
          <span className="mb-6 rounded-full border border-forest/20 bg-forest-soft px-4 py-1.5 text-sm font-medium text-forest-dark">
            La plateforme des métiers IA
          </span>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Là où les métiers IA s&apos;assemblent
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
            OperIA réunit créateurs et entreprises autour d&apos;une même idée :
            construire, partager et déployer les métiers de l&apos;intelligence
            artificielle, ensemble.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#waitlist"
              className="flex h-12 items-center justify-center rounded-full bg-forest px-8 text-base font-semibold text-white transition-colors hover:bg-forest-dark"
            >
              Je suis Créateur
            </a>
            <a
              href="#waitlist"
              className="flex h-12 items-center justify-center rounded-full border border-forest/30 bg-white px-8 text-base font-semibold text-forest-dark transition-colors hover:bg-forest-soft"
            >
              Je suis une Entreprise
            </a>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="w-full scroll-mt-20 pb-24"
        >
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-soft text-2xl text-forest">
                  {f.icon}
                </span>
                <h3 className="mt-5 text-xl font-semibold">{f.title}</h3>
                <p className="mt-3 leading-7 text-muted">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Waitlist */}
        <section
          id="waitlist"
          className="w-full max-w-2xl scroll-mt-20 pb-28"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Rejoignez la liste d&apos;attente
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg text-muted">
              Soyez parmi les premiers à assembler vos métiers IA sur OperIA.
            </p>
          </div>
          <div className="mt-8">
            <WaitlistForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted sm:flex-row">
          <span>
            Oper<span className="text-forest">IA</span> © 2026
          </span>
          <span>Là où les métiers IA s&apos;assemblent.</span>
        </div>
      </footer>
    </div>
  );
}
