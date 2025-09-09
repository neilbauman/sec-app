// app/auth/set-role/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

const ALLOWED = new Set(['public', 'country-admin', 'super-admin'])

export async function GET(req: Request) {
  const url = new URL(req.url)
  const role = url.searchParams.get('role') ?? 'public'
  const to = url.searchParams.get('to') ?? '/dashboard'
  const value = ALLOWED.has(role) ? role : 'public'

  const jar = await cookies()
  // httpOnly false so you can toggle from the UI; tighten later if you prefer
  jar.set('role', value, { path: '/', sameSite: 'lax' })

  return NextResponse.redirect(new URL(to, url))
}
