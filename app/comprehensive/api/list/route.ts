// app/comprehensive/api/list/route.ts
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabaseServer'

// Don’t prerender; we fetch at request time
export const dynamic = 'force-dynamic'

type Ok<T> = { ok: true; data: T[]; tried: string[] }
type Err = { ok: false; stage: string; message: string; tried?: string[] }

function ok<T>(data: T[], tried: string[]): Ok<T> {
  return { ok: true, data, tried }
}
function err(stage: string, message: string, tried?: string[]): Err {
  return { ok: false, stage, message, tried }
}

async function safeSelect<T>(
  from: ReturnType<ReturnType<typeof getServerClient>['from']>,
  preferred: string,
  fallback: string = '*'
): Promise<Ok<T> | Err> {
  const tried: string[] = []
  // Try preferred projection first
  tried.push(preferred)
  let { data, error } = await from.select(preferred).order('sort_order', { ascending: true }).limit(10000)
  if (!error && Array.isArray(data)) return ok<T>(data as T[], tried)

  // Fallback to wildcard
  tried.push(fallback)
  const res2 = await from.select(fallback).order('sort_order', { ascending: true }).limit(10000)
  if (!res2.error && Array.isArray(res2.data)) return ok<T>(res2.data as T[], tried)

  // Still failed
  return err('select', (error || res2.error)?.message ?? 'Unknown select error', tried)
}

export async function GET() {
  // Basic env sanity
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasService = !!process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!hasUrl || !hasService) {
    return NextResponse.json(
      err('env', 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY', ['env']),
      { status: 500 }
    )
  }

  const supabase = getServerClient({ asServiceRole: true })

  // -------- Pillars
  const pillars = await safeSelect<any>(
    supabase.from('pillars'),
    // Adjust list as schema evolves
    'code,name,description,sort_order'
  )
  if (!pillars.ok) return NextResponse.json(pillars, { status: 500 })

  // -------- Themes
  const themes = await safeSelect<any>(
    supabase.from('themes'),
    'code,pillar_code,name,description,sort_order'
  )
  if (!themes.ok) return NextResponse.json(themes, { status: 500 })

  // -------- Subthemes
  const subthemes = await safeSelect<any>(
    supabase.from('subthemes'),
    'code,theme_code,name,description,sort_order'
  )
  if (!subthemes.ok) return NextResponse.json(subthemes, { status: 500 })

  // -------- Indicators
  // We removed owner_code and org_code and rely on the current minimal shape.
  const indicators = await safeSelect<any>(
    supabase.from('indicators'),
    'code,standard_code,short_name,long_name,sort_order'
  )
  if (!indicators.ok) return NextResponse.json({ ...indicators, stage: 'indicators' }, { status: 500 })

  // -------- Levels
  const levels = await safeSelect<any>(
    supabase.from('indicator_levels'),
    'indicator_code,level,criteria_text,default_score,sort_order'
  )
  if (!levels.ok) return NextResponse.json({ ...levels, stage: 'levels' }, { status: 500 })

  // Minimal join in-memory for now
  const byIndicator = new Map<string, any[]>()
  for (const lvl of levels.data) {
    const key = String(lvl.indicator_code)
    if (!byIndicator.has(key)) byIndicator.set(key, [])
    byIndicator.get(key)!.push(lvl)
  }

  const indicatorsWithLevels = indicators.data.map(ind => ({
    ...ind,
    levels: (byIndicator.get(String(ind.code)) || []).sort(
      (a, b) => (a.sort_order ?? a.level ?? 0) - (b.sort_order ?? b.level ?? 0)
    ),
  }))

  return NextResponse.json({
    ok: true,
    meta: {
      env: {
        has_url: hasUrl,
        has_anon_key: hasAnon,
        has_service_key: hasService,
      },
      counts: {
        pillars: pillars.data.length,
        themes: themes.data.length,
        subthemes: subthemes.data.length,
        indicators: indicators.data.length,
        levels: levels.data.length,
      },
    },
    pillars: pillars.data,
    themes: themes.data,
    subthemes: subthemes.data,
    indicators: indicatorsWithLevels,
  })
}
