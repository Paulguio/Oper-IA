import { supabase } from "./supabase";

export type Role = "utilisateur" | "createur";

export type Profile = {
  id: string;
  role: Role;
  nom: string | null;
  prenom: string | null;
  entreprise: string | null;
  taille_entreprise: string | null;
  secteur: string | null;
  source: string | null;
  nom_marque: string | null;
  bio: string | null;
  domaine: string | null;
  outils: string[] | null;
  lien_web: string | null;
  conditions_acceptees: boolean | null;
  created_at: string;
};

/** Colonnes sélectionnées depuis la table profiles. */
const PROFILE_COLUMNS =
  "id, role, nom, prenom, entreprise, taille_entreprise, secteur, source, nom_marque, bio, domaine, outils, lien_web, conditions_acceptees, created_at";

/**
 * Cookie de présence lu par le middleware Next.js (edge/serveur) pour
 * protéger /compte et /createur. La session complète reste gérée par
 * supabase-js ; ce cookie ne sert qu'à la redirection côté middleware.
 * La véritable protection repose sur getUser() + les policies RLS.
 */
export const AUTH_COOKIE = "operia-auth";

export function setAuthCookie(role: Role, remember = true) {
  if (typeof document === "undefined") return;
  // "Se souvenir de moi" → cookie persistant 30 jours ; sinon cookie de
  // session (supprimé à la fermeture du navigateur).
  const maxAge = remember ? `; max-age=${60 * 60 * 24 * 30}` : "";
  document.cookie = `${AUTH_COOKIE}=${role}; path=/${maxAge}; SameSite=Lax`;
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

/** Route de l'espace personnel selon le rôle. */
export function spaceForRole(role: Role): "/compte" | "/createur" {
  return role === "createur" ? "/createur" : "/compte";
}

/** Prénom affichable (repli sur nom puis email). */
export function displayName(
  profile: Pick<Profile, "prenom" | "nom"> | null,
  email?: string | null,
): string {
  return (
    profile?.prenom ||
    profile?.nom ||
    email?.split("@")[0] ||
    "Mon espace"
  );
}

/** Récupère le profil depuis la table `profiles` (null si absent/RLS/offline). */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as Profile;
}

/** Met à jour le profil courant (table profiles) + les métadonnées Auth. */
export async function updateProfile(
  userId: string,
  patch: Partial<Omit<Profile, "id" | "role" | "created_at">>,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId);

  if (error) return { error: error.message };

  // Garde les métadonnées Auth synchronisées (best-effort).
  await supabase.auth.updateUser({ data: patch });
  return { error: null };
}
