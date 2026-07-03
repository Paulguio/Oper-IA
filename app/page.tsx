import BrandLogos from "./components/BrandLogos";
import CountUp from "./components/CountUp";
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

      <main className="flex w-full flex-1 flex-col items-center">
        {/* ===== Hero ===== */}
        <section className="hero-bg grain relative w-full overflow-hidden">
          {/* ambient blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-10 left-1/2 z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-forest/[0.07] blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[8%] top-40 z-0 h-64 w-64 rounded-full bg-forest-soft/60 blur-3xl"
          />

          <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pt-24 pb-28 text-center sm:pt-32">
            <Reveal>
              <span className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-line bg-white/70 px-4 py-1.5 text-forest-dark shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-forest animate-pulse-ring" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-forest" />
                </span>
                <span className="label text-[0.68rem]">Accès anticipé</span>
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="font-display max-w-4xl text-[2.6rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[3.25rem]">
                Là où les métiers IA
                <br className="hidden sm:block" />{" "}
                <span className="relative inline-block whitespace-nowrap text-forest">
                  s&apos;assemblent
                  <svg
                    className="hero-underline"
                    viewBox="0 0 220 14"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 9C40 3.5 92 2.5 134 6C168 8.8 196 9.5 217 5"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      pathLength={1}
                    />
                  </svg>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mx-auto mt-8 max-w-[480px] text-lg leading-8 text-muted">
                OperIA réunit créateurs et entreprises autour d&apos;une même
                idée : construire, partager et déployer les métiers de
                l&apos;intelligence artificielle — ensemble, sans friction.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-11 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#waitlist"
                  className="btn-primary flex h-13 items-center justify-center rounded-full px-8 text-base font-semibold"
                >
                  Je suis Créateur
                </a>
                <a
                  href="#waitlist"
                  className="btn-secondary group flex h-13 items-center justify-center gap-2 rounded-full px-8 text-base font-semibold"
                >
                  Je suis une Entreprise
                  <span className="btn-arrow" aria-hidden>
                    →
                  </span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-20 w-full">
                <div className="mb-7 flex items-center justify-center gap-4">
                  <span className="h-px w-10 bg-line sm:w-16" aria-hidden />
                  <p className="label text-muted">
                    Connectez vos outils du quotidien
                  </p>
                  <span className="h-px w-10 bg-line sm:w-16" aria-hidden />
                </div>
                <BrandLogos />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===== Statistiques ===== */}
        <section className="w-full border-y border-line bg-white">
          <Reveal className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-2 gap-px bg-line lg:grid-cols-4">
              {keyMetrics.map((m) => (
                <div
                  key={m.label}
                  className="flex flex-col items-center justify-center bg-white px-6 py-12 text-center"
                >
                  <CountUp
                    value={m.value}
                    className="font-display text-4xl font-bold tracking-tight text-forest"
                  />
                  <span className="mt-2 text-sm text-muted">{m.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <div className="mx-auto w-full max-w-6xl px-6">
          {/* ===== Ce que ça change ===== */}
          <section className="w-full pt-28 pb-28">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="label mb-4 text-forest">L&apos;impact OperIA</p>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Ce que ça change
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {changes.map((c, i) => (
                <Reveal key={c.title} delay={i * 100}>
                  <div className="card card-hover group h-full p-7">
                    <span className="icon-tile flex h-13 w-13 items-center justify-center rounded-2xl text-2xl text-forest">
                      {c.icon}
                    </span>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight">
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
              <p className="label mb-4 text-forest">Pour qui ?</p>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Pour les entreprises et les indépendants
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
                Quelle que soit votre taille, OperIA s&apos;adapte à votre façon
                de travailler.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              {/* Entreprises — carte sombre */}
              <Reveal>
                <div className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-8 text-white shadow-[0_8px_40px_rgba(0,0,0,0.25)] sm:p-10">
                  <span className="label inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-white/80">
                    Entreprises
                  </span>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight">
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
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[0.95rem] text-white/85"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs text-white">
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                    <div className="font-display text-4xl font-bold text-white">
                      Jusqu&apos;à 30 000€
                    </div>
                    <div className="mt-1.5 text-sm text-white/60">
                      économisés par an face à une agence ou un recrutement.
                    </div>
                  </div>
                  <a
                    href="#waitlist"
                    className="mt-8 flex h-13 items-center justify-center rounded-full bg-white px-8 text-base font-semibold text-ink shadow-sm transition-all hover:bg-white/90 active:scale-[0.98]"
                  >
                    Demander une démo
                  </a>
                </div>
              </Reveal>

              {/* Indépendants — carte claire */}
              <Reveal delay={120}>
                <div className="flex h-full flex-col rounded-[1.75rem] border border-line bg-white p-8 shadow-[var(--shadow-card-hover)] sm:p-10">
                  <span className="label inline-flex w-fit rounded-full bg-forest-soft px-3 py-1 text-forest-dark">
                    Indépendants
                  </span>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
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
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[0.95rem] text-ink"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-soft text-xs text-forest">
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 rounded-2xl border border-forest/15 bg-forest-soft/50 p-5">
                    <div className="font-display text-4xl font-bold text-forest">
                      L&apos;équivalent d&apos;un mi-temps
                    </div>
                    <div className="mt-1.5 text-sm text-muted">
                      pour le prix d&apos;un simple abonnement mensuel.
                    </div>
                  </div>
                  <a
                    href="#waitlist"
                    className="btn-primary mt-8 flex h-13 items-center justify-center rounded-full px-8 text-base font-semibold"
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
              <p className="label mb-4 text-forest">Pourquoi OperIA</p>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
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
                  <div className="card card-hover group h-full p-8">
                    <span className="icon-tile flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-forest">
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
              <p className="label mb-4 text-forest">Comment ça marche</p>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Trois étapes, et c&apos;est parti
              </h2>
            </Reveal>

            <div className="relative mt-16 grid gap-10 sm:grid-cols-3">
              <div
                aria-hidden
                className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-7 hidden border-t border-dashed border-forest/25 sm:block"
              />
              {steps.map((step, i) => (
                <Reveal key={step.n} delay={i * 140} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <span className="font-display flex h-14 w-14 items-center justify-center rounded-full border border-line bg-white text-lg font-bold text-forest shadow-[var(--shadow-card)]">
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
          <Reveal
            as="section"
            id="testimonial"
            className="w-full scroll-mt-24 pb-28"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] border-l-[3px] border-forest bg-beige-deep px-8 py-14 sm:px-16 sm:py-20">
              <span
                aria-hidden
                className="font-display pointer-events-none absolute -left-1 -top-8 select-none text-[11rem] leading-none text-forest/10"
              >
                &ldquo;
              </span>
              <blockquote className="relative mx-auto max-w-3xl text-center">
                <p className="text-2xl font-medium leading-relaxed tracking-tight text-ink sm:text-[1.9rem] sm:leading-[1.5]">
                  Nous avons déployé notre premier agent support en une
                  après-midi. OperIA nous a fait gagner trois semaines de
                  développement — et nos clients ne voient plus la différence
                  avec un humain.
                </p>
                <footer className="mt-10 flex items-center justify-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-lg font-bold text-white ring-4 ring-forest/15">
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
          <Reveal
            as="section"
            id="waitlist"
            className="w-full scroll-mt-24 pb-28"
          >
            <div className="grain grain-strong relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#1a1a1a] to-[#242424] px-6 py-16 shadow-[0_8px_40px_rgba(0,0,0,0.25)] sm:px-16 sm:py-20">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 z-0 h-72 w-72 rounded-full bg-forest/25 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-20 -left-10 z-0 h-72 w-72 rounded-full bg-forest/15 blur-3xl"
              />
              <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
                <div className="text-center lg:text-left">
                  <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Rejoignez la liste d&apos;attente
                  </h2>
                  <p className="mt-4 max-w-md text-lg leading-8 text-white/70 lg:mx-0">
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
                        className="flex items-center justify-center gap-3 text-white/85 lg:justify-start"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-forest text-xs text-white">
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
