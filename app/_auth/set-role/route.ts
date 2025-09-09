// app/auth/set-role/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const role = searchParams.get('role') || 'public'
  const allowed = new Set(['super-admin', 'country-admin', 'public'])

  const r = allowed.has(role) ? role : 'public'

  const res = NextResponse.redirect(new URL('/dashboard', req.url))
  // Cookie for whole site, 7 days
  res.cookies.set('role', r, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
