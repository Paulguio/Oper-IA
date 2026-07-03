"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Fonctionnement", href: "/fonctionnement" },
  { label: "Tarifs", href: "/tarifs" },
];

export default function Header() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line/80 bg-[rgba(250,248,245,0.85)] shadow-[0_1px_0_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-lg font-bold text-white shadow-[0_2px_6px_rgba(61,107,79,0.35)] transition-transform duration-300 group-hover:scale-105">
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
                data-active={active}
                aria-current={active ? "page" : undefined}
                className={`nav-link transition-colors ${
                  active
                    ? "font-semibold text-forest"
                    : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
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
            className="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            S&apos;inscrire
          </Link>
        </div>
      </div>
    </header>
  );
}
