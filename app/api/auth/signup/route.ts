import { NextResponse, type NextRequest } from "next/server";
import { PROFILE_COLUMNS, query } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/session";
import type { Profile, Role } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES: Role[] = ["utilisateur", "createur"];

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");
  const role = (body.role as Role) ?? "utilisateur";

  if (!EMAIL_RE.test(email) || password.length < 6 || !ROLES.includes(role)) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const existing = await query("select id from users where lower(email) = lower($1)", [
    email,
  ]);
  if (existing.length > 0) {
    return NextResponse.json({ error: "email_exists" }, { status: 409 });
  }

  const m = body as Record<string, unknown>;
  const outils = Array.isArray(m.outils) ? (m.outils as string[]) : null;

  const rows = await query<Profile & { role: Role }>(
    `insert into users
       (email, password_hash, role, nom, prenom, entreprise, taille_entreprise,
        secteur, source, nom_marque, bio, domaine, outils, lien_web, conditions_acceptees)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     returning ${PROFILE_COLUMNS}`,
    [
      email,
      hashPassword(password),
      role,
      m.nom ?? null,
      m.prenom ?? null,
      m.entreprise ?? null,
      m.taille_entreprise ?? null,
      m.secteur ?? null,
      m.source ?? null,
      m.nom_marque ?? null,
      m.bio ?? null,
      m.domaine ?? null,
      outils,
      m.lien_web ?? null,
      typeof m.conditions_acceptees === "boolean" ? m.conditions_acceptees : false,
    ],
  );

  const profile = rows[0];
  const res = NextResponse.json({
    user: { id: profile.id, email: profile.email, role: profile.role },
    profile,
  });
  res.cookies.set(SESSION_COOKIE, signSession(profile.id, profile.role), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
