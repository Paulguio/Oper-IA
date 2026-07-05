import { NextResponse, type NextRequest } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const profile = body.profile === "entreprise" ? "entreprise" : "createur";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  try {
    await query("insert into waitlist (email, profile) values ($1, $2)", [
      email,
      profile,
    ]);
  } catch (e) {
    // 23505 = violation de contrainte d'unicité (email déjà inscrit)
    if (e && typeof e === "object" && "code" in e && e.code === "23505") {
      return NextResponse.json({ error: "already_registered" }, { status: 409 });
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
