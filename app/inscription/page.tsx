"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import AuthShell from "../components/AuthShell";
import {
  Checkbox,
  inputClass,
  Label,
  PasswordInput,
  Select,
  ToggleChip,
} from "../components/FormControls";
import PasswordStrength, {
  isPasswordValid,
} from "../components/PasswordStrength";
import { spaceForRole, type Role } from "@/lib/auth";

const ROLES: {
  value: Role;
  label: string;
  description: string;
  icon: string;
}[] = [
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

const TAILLES = [
  "Juste moi",
  "2 à 10 personnes",
  "11 à 50 personnes",
  "50 à 200 personnes",
  "Plus de 200 personnes",
];
const SECTEURS = [
  "E-commerce",
  "Conseil / Consulting",
  "Agence marketing",
  "Immobilier",
  "Finance / Comptabilité",
  "Juridique",
  "Technologie / SaaS",
  "Santé",
  "Education",
  "Autre",
];
const SOURCES = [
  "LinkedIn",
  "Bouche à oreille",
  "Google",
  "Product Hunt",
  "Un ami / collègue",
  "Autre",
];
const DOMAINES = [
  "SEO & Marketing",
  "Finance & Comptabilité",
  "Ressources Humaines",
  "Développement",
  "Support Client",
  "Juridique",
  "Autre",
];
const OUTILS = ["n8n", "Make", "Zapier", "Python", "JavaScript", "Autre"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InscriptionPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role>("utilisateur");

  // Étape 1
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Étape 2 — utilisateur
  const [entreprise, setEntreprise] = useState("");
  const [taille, setTaille] = useState("");
  const [secteur, setSecteur] = useState("");
  const [source, setSource] = useState("");

  // Étape 2 — créateur
  const [nomMarque, setNomMarque] = useState("");
  const [bio, setBio] = useState("");
  const [domaine, setDomaine] = useState("");
  const [outils, setOutils] = useState<string[]>([]);
  const [lienWeb, setLienWeb] = useState("");
  const [conditions, setConditions] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = EMAIL_RE.test(email);
  const confirmMatch = confirm.length > 0 && confirm === password;

  const step1Valid = useMemo(
    () =>
      prenom.trim() !== "" &&
      nom.trim() !== "" &&
      emailValid &&
      isPasswordValid(password) &&
      confirmMatch,
    [prenom, nom, emailValid, password, confirmMatch],
  );

  const step2Valid =
    role === "createur" ? conditions && nomMarque.trim() !== "" : true;

  function toggleOutil(o: string) {
    setOutils((prev) =>
      prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o],
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading || !step2Valid) return;
    setLoading(true);
    setError(null);

    const meta: Record<string, unknown> =
      role === "createur"
        ? {
            role,
            prenom,
            nom,
            nom_marque: nomMarque,
            bio,
            domaine,
            outils,
            lien_web: lienWeb,
            conditions_acceptees: conditions,
          }
        : {
            role,
            prenom,
            nom,
            entreprise,
            taille_entreprise: taille,
            secteur,
            source,
          };

    let res: Response | null = null;
    try {
      res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, ...meta }),
      });
    } catch {
      setError("Impossible de contacter le serveur. Réessayez.");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setError(
        res.status === 409
          ? "Cet email est déjà utilisé. Essayez de vous connecter."
          : "Une erreur est survenue. Veuillez réessayer.",
      );
      setLoading(false);
      return;
    }

    router.replace(spaceForRole(role));
    router.refresh();
  }

  const title = step === 1 ? "Vos informations" : "Votre profil";
  const subtitle =
    step === 1
      ? "Créez votre compte OperIA en deux étapes."
      : role === "createur"
        ? "Présentez-vous à la communauté OperIA."
        : "Aidez-nous à personnaliser votre expérience.";

  return (
    <AuthShell
      title={title}
      subtitle={subtitle}
      footer={
        step === 1 ? (
          <>
            Vous avez déjà un compte ?{" "}
            <Link
              href="/connexion"
              className="font-semibold text-forest hover:text-forest-dark"
            >
              Se connecter
            </Link>
          </>
        ) : undefined
      }
    >
      {/* Barre de progression */}
      <div className="mb-7">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
          <span className={step >= 1 ? "text-forest" : ""}>
            1 · Vos informations
          </span>
          <span className={step >= 2 ? "text-forest" : ""}>
            2 · Votre profil
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-forest transition-all duration-500"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>
      </div>

      {step === 1 ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step1Valid) setStep(2);
          }}
          className="flex flex-col gap-5"
        >
          {/* Rôle */}
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

          {/* Prénom + Nom */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="prenom">Prénom</Label>
              <input
                id="prenom"
                type="text"
                required
                autoComplete="given-name"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Camille"
                className={inputClass}
              />
            </div>
            <div>
              <Label htmlFor="nom">Nom</Label>
              <input
                id="nom"
                type="text"
                required
                autoComplete="family-name"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Laurent"
                className={inputClass}
              />
            </div>
          </div>

          {/* Email */}
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
              className={`${inputClass} ${
                email && !emailValid
                  ? "border-red-300 focus:border-red-400"
                  : ""
              }`}
            />
            {email && !emailValid && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                Format d&apos;email invalide.
              </p>
            )}
          </div>

          {/* Mot de passe */}
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <PasswordInput
              id="password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              placeholder="Choisissez un mot de passe fort"
            />
            {password && <PasswordStrength password={password} />}
          </div>

          {/* Confirmation */}
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
                  confirmMatch ? "text-forest" : "text-red-600"
                }`}
              >
                <span>{confirmMatch ? "✓" : "✗"}</span>
                {confirmMatch
                  ? "Les mots de passe correspondent."
                  : "Les mots de passe ne correspondent pas."}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!step1Valid}
            className="btn-primary w-full rounded-full px-6 py-3 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
          >
            Continuer →
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {role === "utilisateur" ? (
            <>
              <div>
                <Label htmlFor="entreprise" hint="(optionnel)">
                  Nom de l&apos;entreprise
                </Label>
                <input
                  id="entreprise"
                  type="text"
                  value={entreprise}
                  onChange={(e) => setEntreprise(e.target.value)}
                  placeholder="Votre entreprise ou nom complet"
                  className={inputClass}
                />
              </div>
              <div>
                <Label>Taille de l&apos;entreprise</Label>
                <Select
                  value={taille}
                  onChange={setTaille}
                  placeholder="Sélectionnez…"
                  options={TAILLES}
                />
              </div>
              <div>
                <Label>Secteur d&apos;activité</Label>
                <Select
                  value={secteur}
                  onChange={setSecteur}
                  placeholder="Sélectionnez…"
                  options={SECTEURS}
                />
              </div>
              <div>
                <Label>Comment avez-vous connu OperIA ?</Label>
                <Select
                  value={source}
                  onChange={setSource}
                  placeholder="Sélectionnez…"
                  options={SOURCES}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="nomMarque">Nom de marque / pseudo public</Label>
                <input
                  id="nomMarque"
                  type="text"
                  required
                  value={nomMarque}
                  onChange={(e) => setNomMarque(e.target.value)}
                  placeholder="Ex. NyxLabs"
                  className={inputClass}
                />
                <p className="mt-1.5 text-xs text-muted">
                  Ce nom apparaîtra sur votre profil public.
                </p>
              </div>
              <div>
                <Label htmlFor="bio">Bio courte</Label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 150))}
                  maxLength={150}
                  rows={3}
                  placeholder="Décrivez votre expertise en quelques mots…"
                  className={`${inputClass} resize-none`}
                />
                <p className="mt-1 text-right text-xs text-muted">
                  {bio.length} / 150
                </p>
              </div>
              <div>
                <Label>Domaine d&apos;expertise principal</Label>
                <Select
                  value={domaine}
                  onChange={setDomaine}
                  placeholder="Sélectionnez…"
                  options={DOMAINES}
                />
              </div>
              <div>
                <Label>Outils maîtrisés</Label>
                <div className="flex flex-wrap gap-2.5">
                  {OUTILS.map((o) => (
                    <ToggleChip
                      key={o}
                      selected={outils.includes(o)}
                      onClick={() => toggleOutil(o)}
                    >
                      {o}
                    </ToggleChip>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="lienWeb" hint="(optionnel)">
                  Lien LinkedIn ou site web
                </Label>
                <input
                  id="lienWeb"
                  type="url"
                  value={lienWeb}
                  onChange={(e) => setLienWeb(e.target.value)}
                  placeholder="https://linkedin.com/in/…"
                  className={inputClass}
                />
              </div>
              <div className="rounded-2xl border border-line bg-beige/60 p-4">
                <Checkbox
                  id="conditions"
                  checked={conditions}
                  onChange={setConditions}
                >
                  J&apos;accepte les{" "}
                  <a
                    href="#"
                    className="font-medium text-forest hover:text-forest-dark"
                  >
                    conditions créateur OperIA
                  </a>{" "}
                  — commission de 15% sur chaque vente, charte qualité des
                  agents.
                </Checkbox>
              </div>
            </>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-secondary rounded-full px-5 py-3 text-base font-semibold"
            >
              ← Retour
            </button>
            <button
              type="submit"
              disabled={loading || !step2Valid}
              className="btn-primary flex-1 rounded-full px-6 py-3 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
            >
              {loading
                ? "Création…"
                : role === "createur"
                  ? "Créer mon compte créateur →"
                  : "Créer mon compte →"}
            </button>
          </div>
        </form>
      )}
    </AuthShell>
  );
}
