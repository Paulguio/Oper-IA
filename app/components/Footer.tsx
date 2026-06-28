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
    <footer className="border-t border-black/5 bg-beige-deep/50">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-lg font-bold text-white">
                O
              </span>
              <span className="text-xl font-semibold tracking-tight">
                Oper<span className="text-forest">IA</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs leading-7 text-muted">
              Là où les métiers IA s&apos;assemblent. La plateforme qui réunit
              créateurs et entreprises.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-ink">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted transition-colors hover:text-forest"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-8 text-sm text-muted sm:flex-row">
          <span>
            © 2026 Oper<span className="text-forest">IA</span>. Tous droits
            réservés.
          </span>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-forest">
              Confidentialité
            </a>
            <a href="#" className="transition-colors hover:text-forest">
              Conditions
            </a>
            <a href="#" className="transition-colors hover:text-forest">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
