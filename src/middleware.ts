import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Helper: check if a token is a valid unexpired JWT
  const token = request.cookies.get('firebase-token')?.value
  let isValidToken = false

  if (token) {
    try {
      const parts = token.split('.')
      if (parts.length === 3) {
        // Base64URL decode the payload
        const payloadStr = Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
        const payload = JSON.parse(payloadStr)
        const nowInSecs = Math.floor(Date.now() / 1000)
        // Check if token has not expired (with 30s grace window)
        if (payload.exp && payload.exp > nowInSecs - 30) {
          isValidToken = true
        }
      }
    } catch {
      isValidToken = false
    }
  }

  // If already logged in, redirect away from /login and /signup to dashboard or requested redirect
  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) {
    if (isValidToken) {
      const redirectParam = request.nextUrl.searchParams.get('redirect')
      return NextResponse.redirect(new URL(redirectParam || '/dashboard', request.url))
    }
  }

  // Protect upload, verify-email, admin, and dashboard routes
  if (request.nextUrl.pathname.startsWith('/upload') || 
      request.nextUrl.pathname.startsWith('/verify-email') ||
      request.nextUrl.pathname.startsWith('/admin') ||
      request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!isValidToken) {
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
