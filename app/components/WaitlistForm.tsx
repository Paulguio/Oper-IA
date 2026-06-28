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
      <div className="rounded-2xl border border-forest/20 bg-forest-soft px-8 py-10 text-center">
        <p className="text-xl font-semibold text-forest-dark">
          Merci, vous êtes sur la liste&nbsp;!
        </p>
        <p className="mt-2 text-muted">
          Nous vous écrirons à <span className="font-medium">{email}</span> dès
          l&apos;ouverture d&apos;OperIA.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-5 flex gap-2 rounded-full bg-beige-deep p-1">
        <button
          type="button"
          onClick={() => setProfile("createur")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            profile === "createur"
              ? "bg-forest text-white shadow-sm"
              : "text-muted hover:text-ink"
          }`}
        >
          Créateur
        </button>
        <button
          type="button"
          onClick={() => setProfile("entreprise")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            profile === "entreprise"
              ? "bg-forest text-white shadow-sm"
              : "text-muted hover:text-ink"
          }`}
        >
          Entreprise
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="h-12 flex-1 rounded-full border border-black/10 bg-beige px-5 text-base text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20"
        />
        <button
          type="submit"
          className="h-12 rounded-full bg-forest px-7 text-base font-semibold text-white transition-colors hover:bg-forest-dark"
        >
          Rejoindre
        </button>
      </div>
      <p className="mt-3 text-center text-sm text-muted sm:text-left">
        Pas de spam. Désinscription en un clic.
      </p>
    </form>
  );
}
