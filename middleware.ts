import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to public routes
  const publicRoutes = ["/", "/login", "/signup", "/pending", "/unauthorized"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // For protected routes, we'll let the client-side ProtectedRoute component handle the authentication
  // since we're using Firebase authentication which is client-side based

  // This middleware can be extended later to add additional route-based logic if needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
