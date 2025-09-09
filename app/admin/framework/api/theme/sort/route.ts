// app/admin/framework/api/theme/sort/route.ts
import { NextResponse } from 'next/server'
import { getCurrentRole } from '@/lib/role'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const role = await getCurrentRole()
  if (role !== 'super-admin') {
    return NextResponse.json({ ok: false, message: 'Forbidden' }, { status: 403 })
  }

  // We’re still in read-only. This endpoint will be implemented when we wire up actions.
  return NextResponse.json({ ok: false, message: 'Not implemented (read-only mode)' }, { status: 501 })
}
