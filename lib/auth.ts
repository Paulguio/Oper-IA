import { supabase } from "./supabase";

export type Role = "utilisateur" | "createur";

export type Profile = {
  id: string;
  role: Role;
  nom: string | null;
  created_at: string;
};

/**
 * Cookie de présence lu par le middleware Next.js (edge/serveur) pour
 * protéger /compte et /createur. La session complète reste gérée par
 * supabase-js ; ce cookie ne sert qu'à la redirection côté middleware.
 * La véritable protection repose sur getUser() + les policies RLS.
 */
export const AUTH_COOKIE = "operia-auth";

export function setAuthCookie(role: Role) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 30; // 30 jours
  document.cookie = `${AUTH_COOKIE}=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

/** Route de l'espace personnel selon le rôle. */
export function spaceForRole(role: Role): "/compte" | "/createur" {
  return role === "createur" ? "/createur" : "/compte";
}

/** Récupère le profil depuis la table `profiles` (null si absent/RLS/offline). */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, nom, created_at")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as Profile;
}
