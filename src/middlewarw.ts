import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('userId')?.value || request.headers.get('x-user-id')
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/favorites', '/settings']
  const authRoutes = ['/auth']
  
  const { pathname } = request.nextUrl
  
  // If user is authenticated and trying to access auth page, redirect to dashboard
  if (userId && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If user is not authenticated and trying to access protected routes, redirect to auth
  if (!userId && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}