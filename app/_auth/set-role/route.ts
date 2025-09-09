// app/_auth/set-role/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const role = url.searchParams.get('role') ?? 'public'
  if (!['public', 'country-admin', 'super-admin'].includes(role)) {
    return NextResponse.json({ ok: false, message: 'Invalid role' }, { status: 400 })
  }

  const redirectTo = url.searchParams.get('redirect') ?? '/dashboard'
  const res = NextResponse.redirect(new URL(redirectTo, req.url))
  // session cookie – tweak maxAge as you like
  res.cookies.set('role', role, { httpOnly: true, sameSite: 'lax', path: '/' })
  return res
}
