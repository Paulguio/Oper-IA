"use client";

import { useEffect, useState } from "react";
import type { AuthUser, Profile } from "./types";

export type AuthState = {
  loading: boolean;
  user: AuthUser | null;
  profile: Profile | null;
};

/**
 * Hook d'authentification côté client : interroge /api/auth/me
 * (le serveur lit le cookie de session httpOnly et renvoie l'utilisateur).
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: true,
    user: null,
    profile: null,
  });

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (active)
          setState({
            loading: false,
            user: d.user ?? null,
            profile: d.profile ?? null,
          });
      })
      .catch(() => {
        if (active) setState({ loading: false, user: null, profile: null });
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}

/** Déconnexion : invalide le cookie de session côté serveur. */
export async function signOut() {
  await fetch("/api/auth/logout", { method: "POST" });
}
