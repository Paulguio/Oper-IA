import BrandLogos from "./components/BrandLogos";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Reveal from "./components/Reveal";
import WaitlistForm from "./components/WaitlistForm";

const features = [
  {
    icon: "◆",
    title: "Assemblez en quelques minutes",
    description:
      "Composez des métiers IA comme des briques. Pas de code, pas de configuration interminable : choisissez, connectez, lancez. Votre premier agent est opérationnel avant la fin de votre café.",
  },
  {
    icon: "◈",
    title: "Une place de marché vivante",
    description:
      "Accédez à un catalogue grandissant d'agents créés par une communauté d'experts. Trouvez exactement le métier dont vous avez besoin — ou publiez le vôtre et générez des revenus.",
  },
  {
    icon: "❖",
    title: "Conçu pour la confiance",
    description:
      "Sécurité, traçabilité et contrôle des accès intégrés. Vos données restent les vôtres, vos agents travaillent dans un cadre maîtrisé, de la première idée jusqu'à la production.",
  },
];

const stats = [
  { value: "200+", label: "agents disponibles" },
  { value: "40+", label: "créateurs actifs" },
  { value: "4.8★", label: "note moyenne" },
];

const steps = [
  {
    n: "01",
    title: "Choisissez un agent",
    description:
      "Parcourez la place de marché et sélectionnez le métier IA adapté à votre besoin, du support client à l'analyse de données.",
  },
  {
    n: "02",
    title: "Connectez vos outils",
    description:
      "Reliez Google, Slack, Notion ou Gmail en un clic. L'agent accède en toute sécurité aux outils que vous utilisez déjà.",
  },
  {
    n: "03",
    title: "L'agent travaille pour vous",
    description:
      "Laissez-le opérer en autonomie. Suivez ses résultats, ajustez ses priorités, gagnez des heures chaque semaine.",
  },
];

const keyMetrics = [
  { value: "3h", label: "gagnées par semaine" },
  { value: "-60%", label: "de tâches répétitives" },
  { value: "49€", label: "pour commencer" },
  { value: "7 jours", label: "d'essai gratuit" },
];

const changes = [
  {
    icon: "◆",
    title: "3h gagnées",
    description:
      "En moyenne chaque semaine, automatisées sur vos tâches les plus répétitives.",
  },
  {
    icon: "↗",
    title: "+34% de trafic",
    description:
      "De trafic organique supplémentaire pour les sites optimisés par nos agents.",
  },
  {
    icon: "✦",
    title: "1 clic pour connecter",
    description:
      "Reliez Google, Slack, Notion ou Gmail sans la moindre configuration technique.",
  },
  {
    icon: "❖",
    title: "RGPD · Europe",
    description:
      "Vos données hébergées et traitées en Europe, dans le respect du RGPD.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip bg-beige text-ink">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6">
        {/* ===== Hero ===== */}
        <section className="relative flex flex-col items-center pt-24 pb-28 text-center sm:pt-32">
          {/* ambient blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-10 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-forest/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-40 -z-10 h-64 w-64 rounded-full bg-forest-soft blur-3xl"
          />

          <Reveal>
            <span className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-forest/20 bg-white/70 px-4 py-1.5 text-sm font-medium text-forest-dark backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-forest animate-pulse-ring" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-forest" />
              </span>
              La plateforme des métiers IA · accès anticipé
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
              Là où les métiers IA{" "}
              <span className="text-gradient">s&apos;assemblent</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
              OperIA réunit créateurs et entreprises autour d&apos;une même
              idée : construire, partager et déployer les métiers de
              l&apos;intelligence artificielle — ensemble, sans friction.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#waitlist"
                className="flex h-13 items-center justify-center rounded-full bg-forest px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-forest/25 transition-all hover:bg-forest-dark hover:shadow-forest/40 active:scale-[0.98]"
              >
                Je suis Créateur
              </a>
              <a
                href="#waitlist"
                className="flex h-13 items-center justify-center rounded-full border border-forest/25 bg-white px-8 py-3.5 text-base font-semibold text-forest-dark shadow-sm transition-all hover:bg-forest-soft hover:shadow-md active:scale-[0.98]"
              >
                Je suis une Entreprise
              </a>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <div className="mt-16">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Connectez vos outils du quotidien
              </p>
              <BrandLogos />
            </div>
          </Reveal>
        </section>

        {/* ===== Key metrics ===== */}
        <Reveal as="section" className="w-full pb-28">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-black/5 bg-black/5 sm:grid-cols-2 lg:grid-cols-4">
            {keyMetrics.map((m) => (
              <div
                key={m.label}
                className="flex flex-col items-center justify-center bg-white px-6 py-12 text-center"
              >
                <span className="text-5xl font-bold tracking-tight text-forest">
                  {m.value}
                </span>
                <span className="mt-2 text-base text-muted">{m.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ===== Stats ===== */}
        <Reveal as="section" className="w-full pb-28">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-black/5 bg-black/5 sm:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center bg-white px-6 py-12 text-center"
              >
                <span className="text-5xl font-bold tracking-tight text-forest">
                  {s.value}
                </span>
                <span className="mt-2 text-base text-muted">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ===== Ce que ça change ===== */}
        <section className="w-full pb-28">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-forest">
              L&apos;impact OperIA
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ce que ça change
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {changes.map((c, i) => (
              <Reveal key={c.title} delay={i * 100}>
                <div className="group h-full rounded-3xl border border-black/5 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest-darker/10">
                  <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-forest-soft text-2xl text-forest transition-colors group-hover:bg-forest group-hover:text-white">
                    {c.icon}
                  </span>
                  <h3 className="mt-5 text-xl font-bold tracking-tight">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {c.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ===== Audiences ===== */}
        <section id="audiences" className="w-full scroll-mt-24 pb-28">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-forest">
              Pour qui ?
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Pour les entreprises et les indépendants
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
              Quelle que soit votre taille, OperIA s&apos;adapte à votre façon de
              travailler.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {/* Entreprises — fond sombre */}
            <Reveal>
              <div className="flex h-full flex-col rounded-[2rem] bg-ink p-8 text-white shadow-xl shadow-forest-darker/20 sm:p-10">
                <span className="inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/80">
                  Entreprises
                </span>
                <h3 className="mt-5 text-2xl font-bold tracking-tight">
                  Déployez l&apos;IA à grande échelle
                </h3>
                <ul className="mt-7 space-y-4">
                  {[
                    "Gestion centralisée des accès et des équipes",
                    "Sécurité et conformité RGPD",
                    "Support dédié et engagements de service (SLA)",
                    "Facturation unique et tableaux de bord",
                    "Intégrations sur mesure à votre stack",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/90">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs text-white">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-3xl font-bold text-white">
                    Jusqu&apos;à 30 000€
                  </div>
                  <div className="mt-1 text-sm text-white/70">
                    économisés par an face à une agence ou un recrutement.
                  </div>
                </div>
                <a
                  href="#waitlist"
                  className="mt-8 flex h-13 items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-semibold text-ink shadow-sm transition-all hover:bg-white/90 active:scale-[0.98]"
                >
                  Demander une démo
                </a>
              </div>
            </Reveal>

            {/* Indépendants — fond beige */}
            <Reveal delay={120}>
              <div className="flex h-full flex-col rounded-[2rem] border border-black/5 bg-beige-deep p-8 shadow-sm sm:p-10">
                <span className="inline-flex w-fit rounded-full bg-forest-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-forest-dark">
                  Indépendants
                </span>
                <h3 className="mt-5 text-2xl font-bold tracking-tight text-ink">
                  Gagnez du temps dès aujourd&apos;hui
                </h3>
                <ul className="mt-7 space-y-4">
                  {[
                    "Lancez-vous dès 49€/mois, sans engagement",
                    "Aucune compétence technique requise",
                    "Automatisez vos tâches les plus chronophages",
                    "Des agents prêts à l'emploi en quelques minutes",
                    "Résiliez quand vous le souhaitez",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-ink">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-soft text-xs text-forest">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 rounded-2xl border border-forest/15 bg-white p-5">
                  <div className="text-3xl font-bold text-forest">
                    L&apos;équivalent d&apos;un mi-temps
                  </div>
                  <div className="mt-1 text-sm text-muted">
                    pour le prix d&apos;un simple abonnement mensuel.
                  </div>
                </div>
                <a
                  href="#waitlist"
                  className="mt-8 flex h-13 items-center justify-center rounded-full bg-forest px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-forest/25 transition-all hover:bg-forest-dark hover:shadow-forest/40 active:scale-[0.98]"
                >
                  Commencer l&apos;essai gratuit
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===== Features ===== */}
        <section id="features" className="w-full scroll-mt-24 pb-28">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-forest">
              Pourquoi OperIA
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Tout ce qu&apos;il faut pour passer à l&apos;échelle
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
              Une plateforme pensée pour la vitesse, la collaboration et la
              confiance.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 120}>
                <div className="group h-full rounded-3xl border border-black/5 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest-darker/10">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-soft text-2xl text-forest transition-colors group-hover:bg-forest group-hover:text-white">
                    {f.icon}
                  </span>
                  <h3 className="mt-6 text-xl font-semibold">{f.title}</h3>
                  <p className="mt-3 leading-7 text-muted">{f.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ===== How it works ===== */}
        <section id="how" className="w-full scroll-mt-24 pb-28">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-forest">
              Comment ça marche
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trois étapes, et c&apos;est parti
            </h2>
          </Reveal>

          <div className="relative mt-16 grid gap-10 sm:grid-cols-3">
            {/* connecting line */}
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

        {/* ===== Testimonial ===== */}
        <Reveal as="section" id="testimonial" className="w-full scroll-mt-24 pb-28">
          <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white px-8 py-14 shadow-sm sm:px-16 sm:py-20">
            <span
              aria-hidden
              className="pointer-events-none absolute -left-2 -top-6 select-none font-serif text-[10rem] leading-none text-forest-soft"
            >
              &ldquo;
            </span>
            <blockquote className="relative mx-auto max-w-3xl text-center">
              <p className="text-2xl font-medium leading-relaxed tracking-tight text-ink sm:text-3xl">
                Nous avons déployé notre premier agent support en une
                après-midi. OperIA nous a fait gagner trois semaines de
                développement — et nos clients ne voient plus la différence avec
                un humain.
              </p>
              <footer className="mt-10 flex items-center justify-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-lg font-bold text-white">
                  CL
                </span>
                <div className="text-left">
                  <div className="font-semibold text-ink">Camille Laurent</div>
                  <div className="text-sm text-muted">
                    Head of Operations, Nyx Studio
                  </div>
                </div>
              </footer>
            </blockquote>
          </div>
        </Reveal>

        {/* ===== Waitlist ===== */}
        <Reveal as="section" id="waitlist" className="w-full scroll-mt-24 pb-28">
          <div className="relative overflow-hidden rounded-[2rem] bg-forest px-6 py-16 shadow-xl shadow-forest-darker/20 sm:px-16 sm:py-20">
            {/* subtle texture blobs */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-forest-darker/40 blur-2xl"
            />
            <div className="relative mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Rejoignez la liste d&apos;attente
                </h2>
                <p className="mt-4 max-w-md text-lg leading-8 text-white/80 lg:mx-0">
                  Soyez parmi les premiers à assembler vos métiers IA sur
                  OperIA. Accès anticipé, tarifs fondateurs et accompagnement
                  dédié.
                </p>
                <ul className="mt-7 space-y-3">
                  {[
                    "Accès prioritaire à la bêta",
                    "Tarif fondateur à vie",
                    "Onboarding personnalisé",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center justify-center gap-3 text-white/90 lg:justify-start"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs text-white">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <WaitlistForm />
            </div>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
