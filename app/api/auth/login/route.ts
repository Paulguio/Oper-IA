import { NextResponse, type NextRequest } from "next/server";
import { PROFILE_COLUMNS, query } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/session";
import type { Profile, Role } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");
  if (!email || !password) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const rows = await query<Profile & { role: Role; password_hash: string }>(
    `select ${PROFILE_COLUMNS}, password_hash from users where lower(email) = lower($1)`,
    [email],
  );

  const row = rows[0];
  if (!row || !verifyPassword(password, row.password_hash)) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash, ...profile } = row;

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
