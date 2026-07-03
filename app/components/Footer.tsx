import Link from "next/link";

const columns = [
  {
    title: "Produit",
    links: ["Fonctionnalités", "Place de marché", "Tarifs", "Bêta"],
  },
  {
    title: "Ressources",
    links: ["Documentation", "Guides", "Blog", "Support"],
  },
  {
    title: "Entreprise",
    links: ["À propos", "Carrières", "Contact", "Presse"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#141414] text-white/70">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-lg font-bold text-white shadow-[0_2px_8px_rgba(61,107,79,0.4)]">
                O
              </span>
              <span className="text-xl font-semibold tracking-tight text-white">
                Oper<span className="text-forest">IA</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs leading-7 text-white/55">
              Là où les métiers IA s&apos;assemblent. La plateforme qui réunit
              créateurs et entreprises.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="label text-white/45">{col.title}</h4>
              <ul className="mt-5 space-y-3.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="nav-link text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row">
          <span>
            © 2026 Oper<span className="text-forest">IA</span>. Tous droits
            réservés.
          </span>
          <div className="flex gap-6">
            <a href="#" className="nav-link transition-colors hover:text-white">
              Confidentialité
            </a>
            <a href="#" className="nav-link transition-colors hover:text-white">
              Conditions
            </a>
            <a href="#" className="nav-link transition-colors hover:text-white">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
