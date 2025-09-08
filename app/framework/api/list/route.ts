// app/framework/api/list/route.ts
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

function unauthorized() {
  return NextResponse.json({ ok: false, status: 401, message: 'Unauthorized' }, { status: 401 })
}

function readAuthToken(request: Request) {
  // Preferred custom header
  const hdr = request.headers.get('x-internal-token') ?? ''
  if (hdr) return hdr

  // Fallback: Authorization header (Bearer or plain)
  const auth = request.headers.get('authorization') ?? ''
  if (auth) {
    const parts = auth.split(' ')
    return parts.length === 2 ? parts[1] : auth
  }

  return ''
}

export async function GET(request: Request) {
  const envToken = process.env.INTERNAL_API_TOKEN ?? ''
  const token = readAuthToken(request)

  if (!envToken || token !== envToken) return unauthorized()

  try {
    const supabase = getServerClient()

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