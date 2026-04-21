import { auth } from '@/lib/auth-edge'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const isLoginPage = pathname === '/login'

  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = new URL('/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/', req.nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!preview|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
