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
  return {
    id: user.id,
    role,
    nom: typeof meta.nom === "string" ? meta.nom : null,
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
