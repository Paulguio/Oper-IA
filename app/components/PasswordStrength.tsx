"use client";

export type Criterion = { label: string; met: boolean };

export function getPasswordCriteria(pw: string): Criterion[] {
  return [
    { label: "8 caractères minimum", met: pw.length >= 8 },
    { label: "1 lettre majuscule", met: /[A-Z]/.test(pw) },
    { label: "1 chiffre", met: /[0-9]/.test(pw) },
    { label: "1 caractère spécial (!@#$...)", met: /[^A-Za-z0-9]/.test(pw) },
  ];
}

export function getPasswordScore(pw: string): number {
  return getPasswordCriteria(pw).filter((c) => c.met).length;
}

export function isPasswordValid(pw: string): boolean {
  return getPasswordScore(pw) === 4;
}

const LEVELS = [
  { label: "", bar: "bg-line", text: "text-muted" },
  { label: "Faible", bar: "bg-red-500", text: "text-red-600" },
  { label: "Moyen", bar: "bg-orange-500", text: "text-orange-600" },
  { label: "Bon", bar: "bg-yellow-400", text: "text-yellow-600" },
  { label: "Fort", bar: "bg-forest", text: "text-forest" },
];

export default function PasswordStrength({ password }: { password: string }) {
  const criteria = getPasswordCriteria(password);
  const score = criteria.filter((c) => c.met).length;
  const level = LEVELS[score];

  return (
    <div className="mt-3">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
                i <= score ? level.bar : "bg-line"
              }`}
            />
          ))}
        </div>
        {password && (
          <span className={`w-10 text-right text-xs font-semibold ${level.text}`}>
            {level.label}
          </span>
        )}
      </div>

      <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {criteria.map((c) => (
          <li
            key={c.label}
            className={`flex items-center gap-2 text-xs ${
              c.met ? "text-forest" : "text-muted"
            }`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                c.met ? "bg-forest-soft text-forest" : "bg-red-50 text-red-500"
              }`}
            >
              {c.met ? "✓" : "✗"}
            </span>
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
