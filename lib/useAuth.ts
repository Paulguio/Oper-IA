"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {
  clearAuthCookie,
  getProfile,
  setAuthCookie,
  type Profile,
  type Role,
} from "./auth";
import { supabase } from "./supabase";

export type AuthState = {
  loading: boolean;
  user: User | null;
  profile: Profile | null;
};

/** Construit un profil de repli à partir des métadonnées si la table
 *  `profiles` n'est pas (encore) disponible. */
function deriveProfile(user: User, fetched: Profile | null): Profile {
  if (fetched) return fetched;
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const role: Role = meta.role === "createur" ? "createur" : "utilisateur";
  const str = (k: string) => (typeof meta[k] === "string" ? (meta[k] as string) : null);
  return {
    id: user.id,
    role,
    nom: str("nom"),
    prenom: str("prenom"),
    entreprise: str("entreprise"),
    taille_entreprise: str("taille_entreprise"),
    secteur: str("secteur"),
    source: str("source"),
    nom_marque: str("nom_marque"),
    bio: str("bio"),
    domaine: str("domaine"),
    outils: Array.isArray(meta.outils) ? (meta.outils as string[]) : null,
    lien_web: str("lien_web"),
    conditions_acceptees:
      typeof meta.conditions_acceptees === "boolean"
        ? (meta.conditions_acceptees as boolean)
        : null,
    created_at: user.created_at ?? "",
  };
}

/**
 * Hook d'authentification côté client. S'appuie sur la session locale
 * (getSession, sans appel réseau) puis écoute les changements d'état.
 * Maintient le cookie de présence pour le middleware.
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: true,
    user: null,
    profile: null,
  });

  useEffect(() => {
    let active = true;

    async function apply(user: User | null) {
      if (!user) {
        clearAuthCookie();
        if (active) setState({ loading: false, user: null, profile: null });
        return;
      }
      const fetched = await getProfile(user.id);
      const profile = deriveProfile(user, fetched);
      setAuthCookie(profile.role);
      if (active) setState({ loading: false, user, profile });
    }

    // État initial depuis le stockage local (pas de requête réseau).
    supabase.auth.getSession().then(({ data }) => {
      if (active) apply(data.session?.user ?? null);
    });

    // Mises à jour (connexion, déconnexion, refresh du token).
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) apply(session?.user ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

/** Déconnexion : coupe la session, nettoie le cookie. */
export async function signOut() {
  await supabase.auth.signOut();
  clearAuthCookie();
}
