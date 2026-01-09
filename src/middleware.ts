import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

export async function middleware(request: NextRequest) {
  // 1. Protect /mashar routes
  if (request.nextUrl.pathname.startsWith('/mashar')) {
    // Exception for the login page itself
    if (request.nextUrl.pathname === '/mashar/login') {
      return NextResponse.next()
    }

    const cookie = request.cookies.get('session')?.value
    const session = await decrypt(cookie)

    if (!session?.user) {
      return NextResponse.redirect(new URL('/mashar/login', request.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
