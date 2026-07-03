"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthShell from "../components/AuthShell";
import { setAuthCookie, spaceForRole, type Role } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const inputClass =
  "focus-ring w-full rounded-xl border border-line bg-beige px-4 py-3 text-base text-ink transition focus:bg-white";

const ROLES: { value: Role; label: string; description: string; icon: string }[] =
  [
    {
      value: "utilisateur",
      label: "Utilisateur",
      description: "J'utilise des agents IA pour mon activité.",
      icon: "◆",
    },
    {
      value: "createur",
      label: "Créateur",
      description: "Je publie mes propres agents et génère des revenus.",
      icon: "❖",
    },
  ];

export default function InscriptionPage() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("utilisateur");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nom, role },
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/connexion`
            : undefined,
      },
    });

    if (signUpError) {
      const code = signUpError.code ?? "";
      const msg = signUpError.message?.toLowerCase() ?? "";
      if (
        code === "user_already_exists" ||
        msg.includes("already registered") ||
        msg.includes("already been registered")
      ) {
        setError("Cet email est déjà utilisé. Essayez de vous connecter.");
      } else if (code === "weak_password" || msg.includes("password")) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
      setLoading(false);
      return;
    }

    // Supabase renvoie un utilisateur sans identités quand l'email existe
    // déjà (anti-énumération) lorsque la confirmation par email est active.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setError("Cet email est déjà utilisé. Essayez de vous connecter.");
      setLoading(false);
      return;
    }

    if (data.session) {
      // Confirmation d'email désactivée → connexion immédiate.
      setAuthCookie(role);
      router.replace(spaceForRole(role));
      router.refresh();
      return;
    }

    // Confirmation d'email requise.
    setSuccess(
      "Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous.",
    );
    setLoading(false);
  }

  if (success) {
    return (
      <AuthShell
        title="Presque terminé"
        subtitle="Une dernière étape avant de démarrer."
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
          <p className="mt-5 leading-7 text-muted">{success}</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Créer un compte"
      subtitle="Rejoignez OperIA et assemblez vos métiers IA."
      footer={
        <>
          Vous avez déjà un compte ?{" "}
          <Link
            href="/connexion"
            className="font-semibold text-forest hover:text-forest-dark"
          >
            Se connecter
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Choix du rôle */}
        <div>
          <span className="mb-2 block text-sm font-medium text-ink">
            Je m&apos;inscris en tant que
          </span>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => {
              const selected = role === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  aria-pressed={selected}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    selected
                      ? "border-forest bg-forest-soft shadow-[0_0_0_3px_rgba(61,107,79,0.12)]"
                      : "border-line bg-white hover:border-forest/30"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg ${
                      selected
                        ? "bg-forest text-white"
                        : "bg-forest-soft text-forest"
                    }`}
                  >
                    {r.icon}
                  </span>
                  <span className="mt-3 block text-sm font-semibold text-ink">
                    {r.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted">
                    {r.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor="nom"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Prénom
          </label>
          <input
            id="nom"
            type="text"
            required
            autoComplete="given-name"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Camille"
            className={inputClass}
          />
        </div>

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
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6 caractères minimum"
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

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full rounded-full px-6 py-3 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
        >
          {loading ? "Création…" : "Créer mon compte"}
        </button>
      </form>
    </AuthShell>
  );
}
