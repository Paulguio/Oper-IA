"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthShell from "../components/AuthShell";
import {
  getProfile,
  setAuthCookie,
  spaceForRole,
  type Role,
} from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const inputClass =
  "focus-ring w-full rounded-xl border border-line bg-beige px-4 py-3 text-base text-ink transition focus:bg-white";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    setInfo(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      { email, password },
    );

    if (signInError) {
      const code = signInError.code ?? "";
      const msg = signInError.message?.toLowerCase() ?? "";
      if (code === "email_not_confirmed" || msg.includes("not confirmed")) {
        setError(
          "Votre email n'est pas encore confirmé. Vérifiez votre boîte mail pour activer votre compte.",
        );
      } else if (
        code === "invalid_credentials" ||
        msg.includes("invalid login")
      ) {
        setError("Email ou mot de passe incorrect.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
      setLoading(false);
      return;
    }

    // Connexion réussie — déterminer le rôle puis rediriger.
    const user = data.user;
    const profile = user ? await getProfile(user.id) : null;
    const role: Role =
      profile?.role ??
      ((user?.user_metadata?.role as Role) === "createur"
        ? "createur"
        : "utilisateur");
    setAuthCookie(role);

    const redirect =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("redirect")
        : null;
    router.replace(redirect || spaceForRole(role));
    router.refresh();
  }

  async function handleReset() {
    setError(null);
    setInfo(null);
    if (!email) {
      setError("Saisissez d'abord votre email pour recevoir un lien.");
      return;
    }
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/connexion`
          : undefined,
    });
    setInfo(
      "Si un compte existe pour cet email, un lien de réinitialisation vient d'être envoyé.",
    );
  }

  return (
    <AuthShell
      title="Bon retour"
      subtitle="Connectez-vous pour accéder à votre espace OperIA."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link
            href="/inscription"
            className="font-semibold text-forest hover:text-forest-dark"
          >
            Créer un compte
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Email
          </label>
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

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-ink">
              Mot de passe
            </label>
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-medium text-forest hover:text-forest-dark"
            >
              Mot de passe oublié ?
            </button>
          </div>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={inputClass}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-xl bg-forest-soft px-4 py-3 text-sm font-medium text-forest-dark">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full rounded-full px-6 py-3 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </AuthShell>
  );
}
