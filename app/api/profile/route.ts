import { NextResponse, type NextRequest } from "next/server";
import { PROFILE_COLUMNS, query } from "@/lib/db";
import { getSession } from "@/lib/session";
import type { Profile, Role } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Champs modifiables par l'utilisateur (jamais id/role/email/password).
const EDITABLE = [
  "nom",
  "prenom",
  "entreprise",
  "taille_entreprise",
  "secteur",
  "source",
  "nom_marque",
  "bio",
  "domaine",
  "outils",
  "lien_web",
] as const;

export async function PATCH(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const sets: string[] = [];
  const values: unknown[] = [];
  for (const key of EDITABLE) {
    if (key in body) {
      values.push(body[key]);
      sets.push(`${key} = $${values.length}`);
    }
  }

  if (sets.length === 0) {
    return NextResponse.json({ error: "no_fields" }, { status: 400 });
  }

  values.push(session.uid);
  const rows = await query<Profile & { role: Role }>(
    `update users set ${sets.join(", ")} where id = $${values.length}
     returning ${PROFILE_COLUMNS}`,
    values,
  );

  return NextResponse.json({ profile: rows[0] });
}
