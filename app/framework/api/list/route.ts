// app/framework/api/list/route.ts
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

function unauthorized(detail?: any) {
  const body: any = { ok: false, status: 401, message: 'Unauthorized' }
  if (detail) body.detail = detail
  return NextResponse.json(body, { status: 401 })
}

export async function GET(request: Request) {
  // --- temporary debug: compare env vs header without leaking secrets ---
  const envToken = (process.env.INTERNAL_API_TOKEN ?? '')
  const hdrToken = request.headers.get('x-internal-token') ?? ''

  // Only include debug info if caller asks ?debug=1
  const url = new URL(request.url)
  const wantDebug = url.searchParams.get('debug') === '1'

  // auth check
  const authed = envToken.length > 0 && hdrToken === envToken
  if (!authed) {
    const detail = wantDebug
      ? {
          // safe previews (no full secrets)
          hasEnv: envToken.length > 0,
          hasHeader: hdrToken.length > 0,
          envLen: envToken.length,
          headerLen: hdrToken.length,
          // show first 3 chars only to spot whitespace/typos
          envStart3: envToken.slice(0, 3),
          headerStart3: hdrToken.slice(0, 3),
          equal: envToken.length > 0 && hdrToken === envToken,
          note:
            'Using header name x-internal-token. Remove debug after tests pass.',
        }
      : undefined
    return unauthorized(detail)
  }

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
