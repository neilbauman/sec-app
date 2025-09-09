// app/_auth/whoami/route.ts
import { NextResponse } from 'next/server'
import { getCurrentRole } from '@/lib/role'

export const dynamic = 'force-dynamic'

export async function GET() {
  const role = getCurrentRole()
  return NextResponse.json({ ok: true, role })
}
