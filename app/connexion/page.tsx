"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthShell from "../components/AuthShell";
import { inputClass, Label, PasswordInput } from "../components/FormControls";
import { spaceForRole, type Role } from "@/lib/auth";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    let res: Response;
    try {
      res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      setError("Impossible de contacter le serveur. Réessayez.");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setError(
        res.status === 401
          ? "Email ou mot de passe incorrect."
          : "Une erreur est survenue. Veuillez réessayer.",
      );
      setLoading(false);
      return;
    }

    const data = await res.json();
    const role: Role = data.user?.role === "createur" ? "createur" : "utilisateur";
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
