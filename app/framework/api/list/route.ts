// app/framework/api/list/route.ts
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

function unauthorized(detail?: any) {
  const body: any = { ok: false, status: 401, message: 'Unauthorized' }
  if (detail) body.detail = detail
  return NextResponse.json(body, { status: 401 })
}

function readAuthToken(request: Request) {
  // 1) Preferred custom header
  const hdr = request.headers.get('x-internal-token') ?? ''

  // 2) Fallback: Authorization header (Bearer or plain)
  const auth = request.headers.get('authorization') ?? ''
  let fromAuth = ''
  if (auth) {
    const parts = auth.split(' ')
    fromAuth = parts.length === 2 ? parts[1] : auth
  }

  // 3) Debug fallback: query param token, only if debug=1
  const url = new URL(request.url)
  const wantDebug = url.searchParams.get('debug') === '1'
  const qp = wantDebug ? (url.searchParams.get('token') ?? '') : ''

  // choose first non-empty in priority order
  return hdr || fromAuth || qp
}

export async function GET(request: Request) {
  const envToken = process.env.INTERNAL_API_TOKEN ?? ''
  const got = readAuthToken(request)

  const url = new URL(request.url)
  const wantDebug = url.searchParams.get('debug') === '1'

  const authed = envToken.length > 0 && got === envToken
  if (!authed) {
    const detail = wantDebug
      ? {
          hasEnv: envToken.length > 0,
          hasHeader_x_internal_token: !!(request.headers.get('x-internal-token') ?? ''),
          hasHeader_authorization: !!(request.headers.get('authorization') ?? ''),
          gotLen: got.length,
          gotStart3: got.slice(0, 3),
          equal: envToken.length > 0 && got === envToken,
          note: 'Accepts x-internal-token, Authorization, or ?token= when debug=1',
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
