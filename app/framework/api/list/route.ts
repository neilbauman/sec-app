// /app/framework/api/list/route.ts
import { NextResponse } from 'next/server'
import { fetchFrameworkList } from '@/lib/framework'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await fetchFrameworkList()
    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
