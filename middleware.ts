import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE = "operia-auth";

/**
 * Protège les espaces personnels : tout accès à /compte ou /createur
 * sans session redirige vers /connexion (avec l'URL d'origine en
 * paramètre `redirect`). Le rôle précis est vérifié dans chaque page.
 */
export function middleware(req: NextRequest) {
  const authed = req.cookies.get(AUTH_COOKIE)?.value;

  if (!authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/compte/:path*", "/createur/:path*", "/agents/seo/chat/:path*"],
};
