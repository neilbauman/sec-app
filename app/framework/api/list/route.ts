// app/framework/api/list/route.ts
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabaseServer'

// Hard fail if token missing server-side (misconfig guard)
const REQUIRED_TOKEN = process.env.INTERNAL_API_TOKEN || ''

function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ ok: false, status: 401, message }, { status: 401 })
}

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // 1) Check the shared-secret header
  const token = request.headers.get('x-internal-api-token') || ''
  if (!REQUIRED_TOKEN || token !== REQUIRED_TOKEN) {
    return unauthorized()
  }

  // 2) Fetch primary framework (pillars/themes/subthemes) via service client
  try {
    const supabase = getServerClient() // already runs as service role on server
    const { data: pillars, error: pErr } = await supabase
      .from('pillars')
      .select('code, name, description, sort_order')
      .order('sort_order', { ascending: true })
      .limit(10000)

    if (pErr) return NextResponse.json({ ok: false, message: pErr.message }, { status: 500 })

    const { data: themes, error: tErr } = await supabase
      .from('themes')
      .select('code, pillar_code, name, description, sort_order')
      .order('sort_order', { ascending: true })
      .limit(10000)

    if (tErr) return NextResponse.json({ ok: false, message: tErr.message }, { status: 500 })

    const { data: subthemes, error: sErr } = await supabase
      .from('subthemes')
      .select('code, theme_code, name, description, sort_order')
      .order('sort_order', { ascending: true })
      .limit(10000)

    if (sErr) return NextResponse.json({ ok: false, message: sErr.message }, { status: 500 })

    return NextResponse.json({
      ok: true,
      counts: {
        pillars: pillars?.length ?? 0,
        themes: themes?.length ?? 0,
        subthemes: subthemes?.length ?? 0,
      },
      pillars: pillars ?? [],
      themes: themes ?? [],
      subthemes: subthemes ?? [],
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message ?? 'Server error' }, { status: 500 })
  }
}
