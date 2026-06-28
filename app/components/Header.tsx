"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Fonctionnement", href: "/fonctionnement" },
  { label: "Tarifs", href: "/tarifs" },
];

export default function Header() {
  const pathname = usePathname() ?? "/";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

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

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative transition-colors ${
                  active
                    ? "font-semibold text-forest"
                    : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-forest" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <Link
            href="/connexion"
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:text-forest"
          >
            Connexion
          </Link>
          <Link
            href="/inscription"
            className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-forest-dark hover:shadow-md active:scale-[0.98]"
          >
            S&apos;inscrire
          </Link>
        </div>
      </div>
    </header>
  );
}
