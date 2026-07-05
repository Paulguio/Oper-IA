// Session par cookie signé HMAC (natif Node, aucune dépendance).
import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import type { Role } from "./types";

export const SESSION_COOKIE = "operia_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

const SECRET =
  process.env.SESSION_SECRET ?? "dev-insecure-secret-change-me-in-prod";

export type SessionPayload = { uid: string; role: Role; exp: number };

function sign(body: string): string {
  return createHmac("sha256", SECRET).update(body).digest("base64url");
}

export function signSession(uid: string, role: Role): string {
  const payload: SessionPayload = {
    uid,
    role,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifySession(token?: string | null): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString(),
    ) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Lit et valide la session depuis la requête. */
export function getSession(req: NextRequest): SessionPayload | null {
  return verifySession(req.cookies.get(SESSION_COOKIE)?.value);
}
