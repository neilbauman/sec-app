// app/comprehensive/api/list/route.ts
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabaseServer'

// This endpoint runs on the server only (uses service role) and must never be cached.
export const dynamic = 'force-dynamic'

type Row = Record<string, any>

function json(data: any, status = 200) {
  return NextResponse.json(data, { status })
}

/** Select helper that first tries a preferred column list and falls back to '*' if it fails. */
async function safeSelect(
  from: ReturnType<ReturnType<typeof getServerClient>['from']>,
  preferredSelect: string,
  orderBy?: { col: string; asc?: boolean }
) {
  let tried: string[] = []
  tried.push(preferredSelect)

  let { data, error } = await from.select(preferredSelect).order(
    orderBy?.col ?? 'sort_order',
    { ascending: orderBy?.asc ?? true }
  ).limit(10000)

  if (!error) return { ok: true as const, data, tried }

  // fallback to all columns
  tried.push('*')
  const fallback = await from.select('*').order(
    orderBy?.col ?? 'sort_order',
    { ascending: orderBy?.asc ?? true }
  ).limit(10000)

  if (fallback.error) {
    return {
      ok: false as const,
      stage: 'safeSelect',
      message: fallback.error.message,
      tried
    }
  }
  return { ok: true as const, data: fallback.data, tried }
}

/** Build a few readable rows that show how the hierarchy joins together. */
function buildSamples(
  pillars: Row[],
  themes: Row[],
  subthemes: Row[],
  indicators: Row[],
  levels: Row[],
  criteria: Row[]
) {
  const byPillarCode = new Map<string, Row>()
  const byThemeCode = new Map<string, Row>()
  const bySubthemeCode = new Map<string, Row>()
  const levelsByIndicatorId = new Map<number | string, Row[]>()
  const criteriaByLevelId  = new Map<number | string, Row[]>()

  for (const p of pillars) if (p?.code) byPillarCode.set(p.code, p)
  for (const t of themes) if (t?.code)  byThemeCode.set(t.code, t)
  for (const s of subthemes) if (s?.code) bySubthemeCode.set(s.code, s)

  for (const lvl of levels) {
    const k = lvl.indicator_id
    if (!levelsByIndicatorId.has(k)) levelsByIndicatorId.set(k, [])
    levelsByIndicatorId.get(k)!.push(lvl)
  }
  for (const cr of criteria) {
    const k = cr.level_id
    if (!criteriaByLevelId.has(k)) criteriaByLevelId.set(k, [])
    criteriaByLevelId.get(k)!.push(cr)
  }

  const rows: Row[] = []
  for (const ind of indicators.slice(0, 5)) {
    // indicators may point to a subtheme OR directly to a theme
    const st = ind.subtheme_code ? bySubthemeCode.get(ind.subtheme_code) : undefined
    const th = st ? byThemeCode.get(st.theme_code) : (ind.theme_code ? byThemeCode.get(ind.theme_code) : undefined)
    const pl = th ? byPillarCode.get(th.pillar_code) : undefined

    const lvls = levelsByIndicatorId.get(ind.id) ?? []
    const firstLevel = lvls[0]
    const crits = firstLevel ? (criteriaByLevelId.get(firstLevel.id) ?? []) : []

    rows.push({
      pillar: pl?.name ?? null,
      theme: th?.name ?? null,
      subtheme: st?.name ?? null,
      indicator: ind?.name ?? ind?.title ?? null,
      level: firstLevel?.name ?? null,
      criterion: crits[0]?.name ?? null,
    })
  }
  return rows
}

export async function GET() {
  // env guard (these must be set in Vercel → Project → Settings → Environment Variables)
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return json({
      ok: false,
      stage: 'env',
      message: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
      note: 'Set these for the Preview/Production envs.'
    }, 500)
  }

  const supabase = getServerClient() // service role by default in server context

  // ---------- fetch all tables (no indicators.code anywhere) ----------
  const pRes = await safeSelect(supabase.from('pillars'),     'id, code, name, description, sort_order', { col: 'sort_order' })
  if (!pRes.ok) return json({ ok: false, stage: 'pillars', ...pRes }, 500)

  const tRes = await safeSelect(supabase.from('themes'),      'id, code, pillar_code, name, description, sort_order', { col: 'sort_order' })
  if (!tRes.ok) return json({ ok: false, stage: 'themes', ...tRes }, 500)

  const sRes = await safeSelect(supabase.from('subthemes'),   'id, code, theme_code, name, description, sort_order', { col: 'sort_order' })
  if (!sRes.ok) return json({ ok: false, stage: 'subthemes', ...sRes }, 500)

  // IMPORTANT: no "code" here
  const iRes = await safeSelect(
    supabase.from('indicators'),
    'id, subtheme_code, theme_code, name, description, sort_order',
    { col: 'sort_order' }
  )
  if (!iRes.ok) return json({ ok: false, stage: 'indicators', ...iRes }, 500)

  const lRes = await safeSelect(
    supabase.from('levels'),
    'id, indicator_id, name, description, default_score, sort_order',
    { col: 'sort_order' }
  )
  if (!lRes.ok) return json({ ok: false, stage: 'levels', ...lRes }, 500)

  const cRes = await safeSelect(
    supabase.from('criteria'),
    'id, level_id, name, description, sort_order',
    { col: 'sort_order' }
  )
  if (!cRes.ok) return json({ ok: false, stage: 'criteria', ...cRes }, 500)

  // ---------- sample + totals ----------
  const sample = buildSamples(
    pRes.data as Row[],
    tRes.data as Row[],
    sRes.data as Row[],
    iRes.data as Row[],
    lRes.data as Row[],
    cRes.data as Row[],
  )

  return json({
    ok: true,
    totals: {
      pillars:     (pRes.data as Row[]).length,
      themes:      (tRes.data as Row[]).length,
      subthemes:   (sRes.data as Row[]).length,
      indicators:  (iRes.data as Row[]).length,
      levels:      (lRes.data as Row[]).length,
      criteria:    (cRes.data as Row[]).length,
    },
    sample
  })
}
