import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const role = url.searchParams.get('role') || 'public'
  const valid = ['public', 'country-admin', 'super-admin']
  const final = valid.includes(role) ? role : 'public'

  const jar = await cookies()
  jar.set('role', final, { path: '/', httpOnly: false, sameSite: 'lax' })

  const dest = url.searchParams.get('redirect') || '/dashboard'
  return NextResponse.redirect(new URL(dest, url), { headers: { 'Cache-Control': 'no-store' } })
}
