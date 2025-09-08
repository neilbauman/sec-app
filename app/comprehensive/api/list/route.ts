// app/comprehensive/api/list/route.ts
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type FetchAttempt<T> = {
  ok: boolean
  data: T | null
  error?: { message: string }
  tried: string[]
}

/**
 * Try to select a preferred column list first; if that fails (missing columns),
 * fall back to '*' so we don't break deployment while the schema stabilizes.
 */
async function safeSelect<T = any>(
  from: ReturnType<ReturnType<typeof getServerClient>['from']>,
  preferredSelect: string,
): Promise<FetchAttempt<T[]>> {
  const tried: string[] = []
  // First attempt: preferred columns
  tried.push(preferredSelect)
  let { data, error } = await from.select(preferredSelect).order('sort_order', { ascending: true }).limit(10000)
  if (!error) return { ok: true, data, tried }

  // Fallback: select all columns
  tried.push('*')
  const fallback = await from.select('*').order('sort_order', { ascending: true }).limit(10000)
  if (!fallback.error) return { ok: true, data: fallback.data as T[], tried }

  return { ok: false, data: null, error: { message: fallback.error?.message || error.message }, tried }
}

export async function GET() {
  // Env sanity check (service role is required here so we can list everything server-side)
  const hasUrl = !!process.env.SUPABASE_URL
  const hasAnon = !!process.env.SUPABASE_ANON_KEY
  const hasService = !!process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!hasUrl || !hasService) {
    return NextResponse.json(
      {
        ok: false,
        stage: 'env',
        message: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
        envHints: { has_url: hasUrl, has_anon_key: hasAnon, has_service_key: hasService },
        note: 'Set these on Vercel → Project → Settings → Environment Variables (include your preview branch envs).',
      },
      { status: 500 },
    )
  }

  const supabase = getServerClient({ serviceRole: true })

  // 1) Primary framework (for context) ---------------------------------------
  const pillars = await safeSelect(
    supabase.from('pillars'),
    'code,name,description,sort_order',
  )
  const themes = await safeSelect(
    supabase.from('themes'),
    'code,pillar_code,name,description,sort_order',
  )
  const subthemes = await safeSelect(
    supabase.from('subthemes'),
    'code,theme_code,name,description,sort_order',
  )

  // 2) Comprehensive: indicators + levels/criteria (names are flexible) -------
  // Indicators: DO NOT reference `owner_code`. We keep this selection generic.
  const indicators = await safeSelect(
    supabase.from('indicators'),
    // Try a sensible set first; if any are missing we fall back to '*'
    'code,name,description,sort_order,pillar_code,theme_code,subtheme_code,unit,notes',
  )

  // Levels table names differ across drafts. We’ll try a few common ones.
  // Whichever returns data first wins; others are skipped.
  async function tryLevels() {
    const candidates = [
      { table: 'indicator_levels', select: 'indicator_code,level_code,level_name,criteria,default_score,sort_order' },
      { table: 'levels',           select: 'indicator_code,level_code,level_name,criteria,default_score,sort_order' },
    ] as const

    const tried: string[] = []
    for (const c of candidates) {
      tried.push(`${c.table}:${c.select}`)
      try {
        const { data, error } = await supabase
          .from(c.table)
          .select(c.select)
          .order('sort_order', { ascending: true })
          .limit(100000)
        if (!error) return { ok: true as const, data, table: c.table, tried }
      } catch (e: any) {
        // keep going
      }
    }
    return { ok: false as const, data: null, table: null as string | null, tried }
  }

  const levels = await tryLevels()

  // Build response -------------------------------------------------------------
  const debug: Record<string, any> = {
    env: { has_url: hasUrl, has_anon_key: hasAnon, has_service_key: hasService },
    attempts: {
      pillars: pillars.tried,
      themes: themes.tried,
      subthemes: subthemes.tried,
      indicators: indicators.tried,
      levels: levels.tried,
    },
    errors: {
      pillars: pillars.ok ? null : pillars.error?.message,
      themes: themes.ok ? null : themes.error?.message,
      subthemes: subthemes.ok ? null : subthemes.error?.message,
      indicators: indicators.ok ? null : indicators.error?.message,
      levels: levels.ok ? null : 'No known levels table shape found',
    },
    notes: [
      "This endpoint intentionally avoids `owner_code` and uses fallbacks to tolerate schema drift.",
      "If you later add/rename tables, we won't break deployments — you'll just see partial data + debug.",
    ],
  }

  // Totals for quick sanity
  const totals = {
    pillars: pillars.data?.length ?? 0,
    themes: themes.data?.length ?? 0,
    subthemes: subthemes.data?.length ?? 0,
    indicators: indicators.data?.length ?? 0,
    levels: levels.ok ? (levels.data?.length ?? 0) : 0,
  }

  return NextResponse.json({
    ok: true,
    stage: 'done',
    totals,
    pillars: pillars.data ?? [],
    themes: themes.data ?? [],
    subthemes: subthemes.data ?? [],
    indicators: indicators.data ?? [],
    levels: levels.ok ? levels.data : [],
    debug,
  })
}
