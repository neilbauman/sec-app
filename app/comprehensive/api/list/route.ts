// app/comprehensive/api/list/route.ts
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabaseServer'

const REQUIRED_TOKEN = process.env.INTERNAL_API_TOKEN || ''
const unauthorized = () =>
  NextResponse.json({ ok: false, status: 401, message: 'Unauthorized' }, { status: 401 })

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const token = request.headers.get('x-internal-api-token') || ''
  if (!REQUIRED_TOKEN || token !== REQUIRED_TOKEN) return unauthorized()

  try {
    const supabase = getServerClient()

    // Pull a tiny sample for now so we confirm wiring works
    const { data: indicators, error: iErr } = await supabase
      .from('indicators') // ensure this table exists in your DB
      .select('id, code, name, theme_code, subtheme_code')
      .order('id', { ascending: true })
      .limit(5)

    if (iErr) {
      return NextResponse.json({ ok: false, message: iErr.message }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      counts: {
        indicators: indicators?.length ?? 0,
      },
      sample: indicators ?? [],
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message ?? 'Server error' }, { status: 500 })
  }
}
