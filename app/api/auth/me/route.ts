import { NextResponse, type NextRequest } from "next/server";
import { PROFILE_COLUMNS, query } from "@/lib/db";
import { getSession } from "@/lib/session";
import type { Profile, Role } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ user: null, profile: null });
  }

  const rows = await query<Profile & { role: Role }>(
    `select ${PROFILE_COLUMNS} from users where id = $1`,
    [session.uid],
  );
  const profile = rows[0];
  if (!profile) {
    return NextResponse.json({ user: null, profile: null });
  }

  return NextResponse.json({
    user: { id: profile.id, email: profile.email, role: profile.role },
    profile,
  });
}
