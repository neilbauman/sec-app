// app/auth/set-role/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const role = (url.searchParams.get('role') || 'public').toLowerCase()
  const allowed = new Set(['public', 'country-admin', 'super-admin'])
  const val = allowed.has(role) ? role : 'public'

  const res = NextResponse.redirect(new URL('/dashboard', request.url))
  res.cookies.set('role', val, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  })
  return res
}
