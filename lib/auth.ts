// Helpers d'auth côté client (appellent les routes API).
import type { Profile, Role } from "./types";

export type { Profile, Role, AuthUser } from "./types";

/** Route de l'espace personnel selon le rôle. */
export function spaceForRole(role: Role): "/compte" | "/createur" {
  return role === "createur" ? "/createur" : "/compte";
}

/** Prénom affichable (repli sur nom puis email). */
export function displayName(
  profile: Pick<Profile, "prenom" | "nom"> | null,
  email?: string | null,
): string {
  return profile?.prenom || profile?.nom || email?.split("@")[0] || "Mon espace";
}

/** Met à jour le profil de l'utilisateur connecté (PATCH /api/profile).
 *  Le 1er argument (userId) est conservé pour compatibilité mais ignoré :
 *  le serveur identifie l'utilisateur via la session. */
export async function updateProfile(
  _userId: string,
  patch: Partial<Omit<Profile, "id" | "role" | "email" | "created_at">>,
): Promise<{ error: string | null }> {
  try {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return { error: "update_failed" };
    return { error: null };
  } catch {
    return { error: "network_error" };
  }
}
