// app/admin/framework/api/theme/sort/route.ts
import { NextResponse } from 'next/server'
import { getCurrentRole } from '@/lib/role'
import { createClient } from '@/lib/supabaseServer' // your existing server client

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const role = getCurrentRole()
    if (role !== 'super-admin') {
      return NextResponse.json({ ok: false, message: 'Forbidden' }, { status: 403 })
    }

    const { code, direction } = await req.json() as { code: string; direction: 'up' | 'down' }
    if (!code || !direction) {
      return NextResponse.json({ ok: false, message: 'Bad request' }, { status: 400 })
    }

    const supabase = createClient()

    // 1) Find this theme
    const { data: theme, error: e1 } = await supabase
      .from('themes')
      .select('code, sort_order, pillar_code')
      .eq('code', code)
      .single()
    if (e1 || !theme) return NextResponse.json({ ok: false, message: 'Theme not found' }, { status: 404 })

    // 2) Find neighbor in the same pillar (by sort_order)
    const op = direction === 'up' ? 'lt' : 'gt'
    const order = direction === 'up' ? { ascending: false } : { ascending: true }

    const { data: neighbor, error: e2 } = await supabase
      .from('themes')
      .select('code, sort_order')
      .eq('pillar_code', theme.pillar_code)
      [op]('sort_order', theme.sort_order) // lt or gt
      .order('sort_order', order)
      .limit(1)
      .maybeSingle()

    if (e2 || !neighbor) {
      // no neighbor (already top/bottom) — treat as ok
      return NextResponse.json({ ok: true, noNeighbor: true })
    }

    // 3) Swap sort_order
    const { error: e3 } = await supabase.rpc('swap_theme_sort',
      { a_code: theme.code, a_sort: theme.sort_order, b_code: neighbor.code, b_sort: neighbor.sort_order }
    )

    // If you don't have that RPC yet, you can do two updates inside a transaction on the DB,
    // or do a temp swap via a large sentinel. RPC is simplest & atomic.

    if (e3) return NextResponse.json({ ok: false, message: e3.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? 'Error' }, { status: 500 })
  }
}
