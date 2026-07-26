
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

// Define protected and guest-only route prefixes
const protectedPrefixes = ["/dashboard", "/settings", "/profile", "/stage"];
const authPrefixes = ["/login", "/register", "/verify-email"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Read token from cookies
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = Boolean(token);

  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = authPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // 2. Unauthenticated user accessing a protected route
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Authenticated user accessing /login or /register
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Ensure middleware doesn't run on static assets, images, or Next.js internals
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};