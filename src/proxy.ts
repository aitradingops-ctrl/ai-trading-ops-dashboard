import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PRIVATE_PREFIXES = [
  "/dashboard",
  "/watchlist",
  "/signals",
  "/trades",
  "/risk",
  "/journal",
  "/calendar",
  "/settings",
  "/admin",
];

function hasSessionCookie(request: NextRequest): boolean {
  return Boolean(
    request.cookies.get("next-auth.session-token") ||
      request.cookies.get("__Secure-next-auth.session-token"),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivatePage = PRIVATE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!isPrivatePage || hasSessionCookie(request)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/watchlist/:path*",
    "/signals/:path*",
    "/trades/:path*",
    "/risk/:path*",
    "/journal/:path*",
    "/calendar/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
