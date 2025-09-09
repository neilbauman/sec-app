// app/_auth/set-role/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { AppRole } from '@/lib/role'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const role = url.searchParams.get('role') as AppRole | null
  const valid = role === 'super-admin' || role === 'country-admin' || role === 'public'

  const jar = await cookies()
  if (valid) {
    jar.set('role', role!, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  }

  // go back to dashboard by default, or ?redirect=...
  const redirect = url.searchParams.get('redirect') || '/dashboard'
  return NextResponse.redirect(new URL(redirect, req.url))
}
