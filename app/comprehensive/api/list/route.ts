// app/comprehensive/internal/list/route.ts
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabaseServer'

// avoid static prerender
export const dynamic = 'force-dynamic'

type Row = Record<string, any>

function isMissingRelation(err?: { message?: string }) {
  return !!err?.message && /does not exist|relation .* does not exist/i.test(err.message)
}

async function safeSelect<T = Row>(
  from: ReturnType<ReturnType<typeof getServerClient>['from']>,
  preferredSelect: string
): Promise<{ ok: true; data: T[] } | { ok: false; data: T[]; error: string }> {
  // try only specific columns first; fall back to "*"
  let { data, error } = await from.select(preferredSelect).order('sort_order', { ascending: true }).limit(10000)
  if (!error) return { ok: true, data: (data ?? []) as T[] }

  // if table exists but columns mismatch, try "*"
  const anySel = await from.select('*').order('sort_order', { ascending: true }).limit(10000)
  if (!anySel.error) return { ok: true, data: (anySel.data ?? []) as T[] }

  // swallow "relation does not exist" so we can ship partial results
  return { ok: false, data: [], error: anySel.error?.message || error?.message || 'unknown' }
}

export async function GET(req: Request) {
  // ---- token guard ----
  const token = req.headers.get('x-internal-token') || ''
  if (!process.env.INTERNAL_API_TOKEN || token !== process.env.INTERNAL_API_TOKEN) {
    return NextResponse.json({ ok: false, status: 401, message: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getServerClient() // service role inside getServerClient()

  // ---------- primary framework ----------
  const pillarsRes = await safeSelect(
    supabase.from('pillars'),
    'code, name, description, sort_order'
  )
  const themesRes = await safeSelect(
    supabase.from('themes'),
    'code, pillar_code, name, description, sort_order'
  )
  const subthemesRes = await safeSelect(
    supabase.from('subthemes'),
    'code, theme_code, name, description, sort_order'
  )

  // ---------- comprehensive (best-effort / optional) ----------
  const indicatorsRes = await safeSelect(
    supabase.from('indicators'),
    'id, code, theme_code, subtheme_code, name, description, sort_order'
  )

  const levelsRes = await safeSelect(
    supabase.from('levels'),
    'id, indicator_id, name, description, default_score, sort_order'
  )

  const criteriaRes = await safeSelect(
    supabase.from('criteria'),
    'id, level_id, description, sort_order'
  )

  // standards (pillar + theme + subtheme tuples) from primary
  const pillars = (pillarsRes.ok ? pillarsRes.data : []) as Row[]
  const themes = (themesRes.ok ? themesRes.data : []) as Row[]
  const subthemes = (subthemesRes.ok ? subthemesRes.data : []) as Row[]

  const themeByCode = new Map(themes.map(t => [t.code, t]))
  const pillarByCode = new Map(pillars.map(p => [p.code, p]))

  const standards = subthemes.map(st => {
    const theme = themeByCode.get(st.theme_code)
    const pillar = theme ? pillarByCode.get(theme.pillar_code) : undefined
    return {
      pillar_code: pillar?.code ?? null,
      pillar_name: pillar?.name ?? null,
      theme_code: theme?.code ?? null,
      theme_name: theme?.name ?? null,
      subtheme_code: st.code ?? null,
      subtheme_name: st.name ?? null,
    }
  })

  const payload = {
    ok: true,
    counts: {
      pillars: pillars.length,
      themes: themes.length,
      subthemes: subthemes.length,
      indicators: indicatorsRes.ok ? indicatorsRes.data.length : 0,
      levels: levelsRes.ok ? levelsRes.data.length : 0,
      criteria: criteriaRes.ok ? criteriaRes.data.length : 0,
    },
    standards,
    notes: {
      indicatorsTable:
        indicatorsRes.ok ? 'ok' :
        (isMissingRelation({ message: (indicatorsRes as any).error }) ? 'missing' : 'error'),
      levelsTable:
        levelsRes.ok ? 'ok' :
        (isMissingRelation({ message: (levelsRes as any).error }) ? 'missing' : 'error'),
      criteriaTable:
        criteriaRes.ok ? 'ok' :
        (isMissingRelation({ message: (criteriaRes as any).error }) ? 'missing' : 'error'),
    },
    samples: {
      indicator: indicatorsRes.ok ? indicatorsRes.data.slice(0, 3) : [],
      level: levelsRes.ok ? levelsRes.data.slice(0, 3) : [],
      criterion: criteriaRes.ok ? criteriaRes.data.slice(0, 3) : [],
    },
  }

  return NextResponse.json(payload, { status: 200 })
}
