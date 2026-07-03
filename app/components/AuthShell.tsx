import Link from "next/link";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="hero-bg grain relative flex min-h-screen flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-forest/[0.06] blur-3xl"
      />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="group mb-8 flex items-center justify-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-lg font-bold text-white shadow-[0_2px_8px_rgba(61,107,79,0.35)] transition-transform duration-300 group-hover:scale-105">
            O
          </span>
          <span className="text-xl font-semibold tracking-tight">
            Oper<span className="text-forest">IA</span>
          </span>
        </Link>

        <div className="card p-8 sm:p-10">
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>

        {footer && (
          <div className="mt-6 text-center text-sm text-muted">{footer}</div>
        )}
      </div>
    </div>
  );
}
