import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { canAccessSection } from "@/lib/permissions";
import { sectionFromPath } from "@/lib/dashboard-nav";

// Proxy (Next.js 16's rename of Middleware) runs in the Edge runtime, which
// can't load the `better-sqlite3` native addon behind Prisma — so this uses
// the edge-safe `authConfig` (no providers) purely to decode the existing
// session JWT, never to authenticate. Real sign-in happens through
// `src/lib/auth.ts` in Node.js.
const { auth } = NextAuth(authConfig);

/**
 * Site-wide "coming soon" toggle: while false, every public-facing page is
 * transparently swapped for `/onderhoud` (the dashboard and login keep
 * working normally, so building/testing behind the scenes is unaffected).
 * Flip to true at launch.
 */
const PUBLIC_SITE_LIVE = false;

/**
 * Lets someone who knows this token browse the real site while
 * `PUBLIC_SITE_LIVE` is still false — visit any page once with
 * `?preview=<this value>` and a cookie remembers it for a month, without
 * exposing the site to regular visitors. Not a security boundary, just a
 * "don't index/share this yet" gate.
 */
const PREVIEW_SECRET = "O3C45svEhMQnZfVt";
const PREVIEW_COOKIE = "kv_preview";

/**
 * Fast, optimistic gate for every request: redirects logged-out or
 * under-permissioned users away from `/dashboard/*` before the page even
 * renders, and (while `PUBLIC_SITE_LIVE` is false) rewrites every public
 * route to the maintenance page unless the preview cookie/token is present.
 * Next.js deliberately scopes Proxy to "optimistic checks" only (see their
 * auth guide) — the authoritative check for dashboard access is the
 * `await auth()` call in `src/app/dashboard/layout.tsx`, which re-verifies
 * on every request this proxy lets through.
 */
export const proxy = auth((req) => {
  const { pathname, searchParams } = req.nextUrl;
  const session = req.auth;

  if (pathname.startsWith("/dashboard")) {
    if (!session?.user) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const section = sectionFromPath(pathname);
    if (section && !canAccessSection(session.user.role, section)) {
      return NextResponse.redirect(new URL("/dashboard/geen-toegang", req.nextUrl.origin));
    }

    return NextResponse.next();
  }

  const previewToken = searchParams.get("preview");
  const hasPreviewCookie = req.cookies.get(PREVIEW_COOKIE)?.value === PREVIEW_SECRET;
  const isPreview = previewToken === PREVIEW_SECRET || hasPreviewCookie;

  // Pages that stay reachable even while the rest of the public site shows
  // the maintenance placeholder.
  const isExempt = pathname === "/login" || pathname === "/onderhoud" || pathname === "/solliciteren";

  if (!PUBLIC_SITE_LIVE && !isExempt && !isPreview) {
    return NextResponse.rewrite(new URL("/onderhoud", req.nextUrl.origin));
  }

  const response = NextResponse.next();
  if (previewToken === PREVIEW_SECRET && !hasPreviewCookie) {
    response.cookies.set(PREVIEW_COOKIE, PREVIEW_SECRET, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "lax",
    });
  }
  return response;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|svg|jpg|jpeg|ico|txt|xml)$).*)"],
};
