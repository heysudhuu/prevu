import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Simple check for Firebase token in cookies
  const hasToken = request.cookies.has('firebase-token')

  // If already logged in, redirect away from /login and /signup to dashboard or requested redirect
  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) {
    if (hasToken) {
      const redirectParam = request.nextUrl.searchParams.get('redirect')
      return NextResponse.redirect(new URL(redirectParam || '/dashboard', request.url))
    }
  }

  // Protect upload, verify-email, admin, and dashboard routes
  if (request.nextUrl.pathname.startsWith('/upload') || 
      request.nextUrl.pathname.startsWith('/verify-email') ||
      request.nextUrl.pathname.startsWith('/admin') ||
      request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!hasToken) {
      const redirectUrl = new URL('/login', request.url)
      const fullPath = request.nextUrl.pathname + request.nextUrl.search
      redirectUrl.searchParams.set('redirect', fullPath)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
