import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/', '/api/auth'];

// Routes that require admin role
const adminRoutes = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session token from cookie
  const sessionToken = request.cookies.get('spanish_session')?.value;

  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // Allow static assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') ||
    pathname.startsWith('/uploads')
  ) {
    return NextResponse.next();
  }

  // For protected routes, we need to check the session
  // Since middleware runs on the edge and can't access the file system directly,
  // we'll let the pages handle the auth check via the AuthContext
  // The middleware will just ensure the cookie exists

  // For now, let all requests through and let the client-side
  // AuthContext handle the protection
  // In a production app with a proper database, you'd validate the session here

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
