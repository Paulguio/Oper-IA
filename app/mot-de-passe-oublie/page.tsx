"use client";

import Link from "next/link";
import { useState } from "react";
import AuthShell from "../components/AuthShell";
import { inputClass, Label } from "../components/FormControls";
import { supabase } from "@/lib/supabase";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/reinitialiser-mdp`
          : undefined,
    });

    // On affiche toujours la confirmation (anti-énumération d'emails).
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <AuthShell
        title="Email envoyé !"
        subtitle="Vérifiez votre boîte mail."
        footer={
          <Link
            href="/connexion"
            className="font-semibold text-forest hover:text-forest-dark"
          >
            Retour à la connexion
          </Link>
        }
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-soft text-2xl text-forest">
            ✉
          </div>
          <p className="mt-5 leading-7 text-muted">
            Si un compte existe pour{" "}
            <span className="font-semibold text-ink">{email}</span>, un lien de
            réinitialisation vient d&apos;être envoyé. Pensez à vérifier vos
            spams.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Mot de passe oublié"
      subtitle="Saisissez votre email pour recevoir un lien de réinitialisation."
      footer={
        <Link
          href="/connexion"
          className="font-semibold text-forest hover:text-forest-dark"
        >
          Retour à la connexion
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <Label htmlFor="email">Email</Label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full rounded-full px-6 py-3 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
        >
          {loading ? "Envoi…" : "Envoyer le lien de réinitialisation"}
        </button>
      </form>
    </AuthShell>
  );
}
