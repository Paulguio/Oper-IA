"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthShell from "../components/AuthShell";
import {
  Checkbox,
  inputClass,
  Label,
  PasswordInput,
} from "../components/FormControls";
import { getProfile, setAuthCookie, spaceForRole, type Role } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      { email, password },
    );

    if (signInError) {
      const code = signInError.code ?? "";
      const msg = signInError.message?.toLowerCase() ?? "";
      if (code === "email_not_confirmed" || msg.includes("not confirmed")) {
        setError("Veuillez confirmer votre email avant de vous connecter.");
      } else if (
        code === "user_not_found" ||
        msg.includes("user not found") ||
        msg.includes("no user")
      ) {
        setError("Aucun compte trouvé avec cet email.");
      } else if (
        code === "invalid_credentials" ||
        msg.includes("invalid login")
      ) {
        // Supabase ne distingue pas email inconnu / mauvais mot de passe.
        setError("Mot de passe incorrect, ou aucun compte pour cet email.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
      setLoading(false);
      return;
    }

    const user = data.user;
    const profile = user ? await getProfile(user.id) : null;
    const role: Role =
      profile?.role ??
      ((user?.user_metadata?.role as Role) === "createur"
        ? "createur"
        : "utilisateur");
    setAuthCookie(role, remember);

    const redirect =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("redirect")
        : null;
    router.replace(redirect || spaceForRole(role));
    router.refresh();
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

        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            placeholder="••••••••"
          />
          <div className="mt-2 text-right">
            <Link
              href="/mot-de-passe-oublie"
              className="text-sm font-medium text-forest hover:text-forest-dark"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        <Checkbox id="remember" checked={remember} onChange={setRemember}>
          Se souvenir de moi
        </Checkbox>

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
          disabled={loading}
          className="btn-primary w-full rounded-full px-6 py-3 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
        >
          {loading ? "Connexion en cours…" : "Se connecter"}
        </button>
      </form>
    </AuthShell>
  );
}
