// app/auth/set-role/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { AppRole } from '@/lib/role'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const role = (url.searchParams.get('role') ?? 'public') as AppRole
  const allowed: AppRole[] = ['super-admin', 'country-admin', 'public']
  const target = allowed.includes(role) ? role : 'public'

  // set role cookie (httpOnly false is fine here since this is a simple demo switch)
  cookies().set('role', target, {
    httpOnly: false,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })

  const redirectTo = url.searchParams.get('redirect') || '/dashboard'
  return NextResponse.redirect(new URL(redirectTo, url.origin))
}
