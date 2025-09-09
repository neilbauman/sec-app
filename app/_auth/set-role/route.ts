// app/_auth/set-role/route.ts
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const VALID = new Set(['public', 'country-admin', 'super-admin'])

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const role = (searchParams.get('role') || 'public').toLowerCase()

  // sanitize
  const value = VALID.has(role) ? role : 'public'

  const res = NextResponse.redirect(new URL('/dashboard', req.url))
  // httpOnly not set so you can flip roles easily from client during dev
  res.cookies.set('role', value, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: 'lax',
  })
  return res
}
