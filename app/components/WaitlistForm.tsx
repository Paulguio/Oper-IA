"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<"createur" | "entreprise">("createur");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    // TODO: brancher sur un vrai endpoint / service d'emailing
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-white/15 bg-white/10 px-8 py-12 text-center backdrop-blur-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl text-forest">
          ✓
        </div>
        <p className="text-2xl font-semibold text-white">
          Vous êtes sur la liste&nbsp;!
        </p>
        <p className="mt-3 text-white/80">
          Nous écrirons à <span className="font-semibold">{email}</span> dès
          l&apos;ouverture d&apos;OperIA.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-black/5 bg-white p-7 shadow-xl shadow-forest-darker/10 sm:p-9"
    >
      <div className="mb-6 flex gap-1.5 rounded-full bg-beige-deep p-1.5">
        {(
          [
            ["createur", "Créateur"],
            ["entreprise", "Entreprise"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setProfile(value)}
            className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
              profile === value
                ? "bg-forest text-white shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          aria-label="Adresse email"
          className="h-13 flex-1 rounded-full border border-black/10 bg-beige px-5 py-3.5 text-base text-ink outline-none transition focus:border-forest focus:bg-white focus:ring-4 focus:ring-forest/15"
        />
        <button
          type="submit"
          className="h-13 rounded-full bg-forest px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-forest/25 transition-all hover:bg-forest-dark hover:shadow-forest/40 active:scale-[0.98]"
        >
          Rejoindre →
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 sm:justify-start">
        <div className="flex -space-x-2.5">
          {["#4a7c59", "#3c6649", "#5d6b62", "#2f4f39"].map((c, i) => (
            <span
              key={i}
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white"
              style={{ backgroundColor: c }}
            >
              {["A", "M", "L", "S"][i]}
            </span>
          ))}
        </div>
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink">+40 créateurs</span> déjà
          inscrits
        </p>
      </div>
    </form>
  );
}
