// Pool PostgreSQL (serveur uniquement — routes API).
import { Pool } from "pg";
import type { Profile } from "./types";

const globalForPg = globalThis as unknown as { _operiaPool?: Pool };

export const pool =
  globalForPg._operiaPool ??
  new Pool({
    connectionString:
      process.env.DATABASE_URL ??
      "postgres://operia:operia@localhost:5432/operia",
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg._operiaPool = pool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const res = await pool.query(text, params);
  return res.rows as T[];
}

/** Colonnes du profil (sans le hash de mot de passe). */
export const PROFILE_COLUMNS = `
  id, role, email, nom, prenom, entreprise, taille_entreprise, secteur,
  source, nom_marque, bio, domaine, outils, lien_web, conditions_acceptees,
  created_at
`;

export type UserRow = Profile & { password_hash?: string };
