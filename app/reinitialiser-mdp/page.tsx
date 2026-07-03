"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthShell from "../components/AuthShell";
import { Label, PasswordInput } from "../components/FormControls";
import PasswordStrength, {
  isPasswordValid,
} from "../components/PasswordStrength";
import { supabase } from "@/lib/supabase";

export default function ReinitialiserMdpPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const match = confirm.length > 0 && confirm === password;
  const valid = isPasswordValid(password) && match;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading || !valid) return;
    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(
        "Le lien est peut-être expiré. Redemandez un email de réinitialisation.",
      );
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
    setTimeout(() => router.replace("/connexion"), 2000);
  }

  if (done) {
    return (
      <AuthShell
        title="Mot de passe mis à jour"
        subtitle="Vous allez être redirigé vers la connexion."
        footer={
          <Link
            href="/connexion"
            className="font-semibold text-forest hover:text-forest-dark"
          >
            Aller à la connexion
          </Link>
        }
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-soft text-2xl text-forest">
            ✓
          </div>
          <p className="mt-5 leading-7 text-muted">
            Votre nouveau mot de passe a bien été enregistré.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Nouveau mot de passe"
      subtitle="Choisissez un nouveau mot de passe sécurisé."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <Label htmlFor="password">Nouveau mot de passe</Label>
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            placeholder="Nouveau mot de passe"
          />
          {password && <PasswordStrength password={password} />}
        </div>
        <div>
          <Label htmlFor="confirm">Confirmer le mot de passe</Label>
          <PasswordInput
            id="confirm"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            placeholder="Retapez votre mot de passe"
          />
          {confirm.length > 0 && (
            <p
              className={`mt-1.5 flex items-center gap-1.5 text-xs font-medium ${
                match ? "text-forest" : "text-red-600"
              }`}
            >
              <span>{match ? "✓" : "✗"}</span>
              {match
                ? "Les mots de passe correspondent."
                : "Les mots de passe ne correspondent pas."}
            </p>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !valid}
          className="btn-primary w-full rounded-full px-6 py-3 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
        >
          {loading ? "Enregistrement…" : "Réinitialiser mon mot de passe"}
        </button>
      </form>
    </AuthShell>
  );
}
