import Link from "next/link";

const navLinks = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Fonctionnalités", href: "/#features" },
  { label: "Comment ça marche", href: "/#how" },
  { label: "Témoignages", href: "/#testimonial" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-beige/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-lg font-bold text-white shadow-sm">
            O
          </span>
          <span className="text-xl font-semibold tracking-tight">
            Oper<span className="text-forest">IA</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#waitlist"
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-forest-dark hover:shadow-md active:scale-[0.98]"
        >
          Rejoindre
        </Link>
      </div>
    </header>
  );
}
