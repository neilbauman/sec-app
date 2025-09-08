// app/comprehensive/api/list/route.ts
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

// Small helper to keep responses consistent
function err(message: string, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: false, message, ...extra }, { status: 200 })
}

export async function GET() {
  try {
    const supabase = getServerClient()

    // --- First: try the optional comprehensive view if you’ve added it
    // Expecting columns like:
    // pillar_code, pillar_name, theme_code, theme_name, subtheme_code (nullable), subtheme_name (nullable),
    // indicator_code (nullable), indicator_name (nullable), level_code (nullable), level_name (nullable), default_score (nullable), sort_order
    const viewAttempt = await supabase
      .from('comprehensive_items')
      .select('*')
      .order('pillar_code', { ascending: true })
      .order('theme_code', { ascending: true })
      .order('subtheme_code', { ascending: true, nullsFirst: true })
      .order('indicator_code', { ascending: true, nullsFirst: true })
      .limit(100000)

    if (viewAttempt.data && !viewAttempt.error) {
      return NextResponse.json({
        ok: true,
        mode: 'view',
        count: viewAttempt.data.length,
        items: viewAttempt.data,
      })
    }

    // If the view doesn’t exist (Postgres code 42P01) or any other error, fall back to Primary-only
    // We’ll return “standards” as the lowest available depth (pillar+theme+optional subtheme)
    // without indicators/levels so the UI can render something stable today.
    const [pillarsRes, themesRes, subthemesRes] = await Promise.all([
      supabase
        .from('pillars')
        .select('code,name,description,sort_order')
        .order('sort_order', { ascending: true }),
      supabase
        .from('themes')
        .select('code,name,description,sort_order,pillar_code')
        .order('sort_order', { ascending: true }),
      supabase
        .from('subthemes')
        .select('code,name,description,sort_order,theme_code')
        .order('sort_order', { ascending: true }),
    ])

    if (pillarsRes.error) {
      return err('Failed to read pillars', { stage: 'pillars', detail: pillarsRes.error.message })
    }
    if (themesRes.error) {
      return err('Failed to read themes', { stage: 'themes', detail: themesRes.error.message })
    }
    if (subthemesRes.error) {
      return err('Failed to read subthemes', { stage: 'subthemes', detail: subthemesRes.error.message })
    }

    const pillars = pillarsRes.data ?? []
    const themes = themesRes.data ?? []
    const subthemes = subthemesRes.data ?? []

    // Build a flattened list of “standards” at the lowest depth available:
    // - If subthemes exist for a theme, each (pillar, theme, subtheme) is a standard
    // - If no subthemes for a theme, (pillar, theme) is a standard
    const themesByPillar = new Map<string, typeof themes>()
    for (const t of themes) {
      const arr = themesByPillar.get(t.pillar_code) || []
      arr.push(t)
      themesByPillar.set(t.pillar_code, arr)
    }

    const subthemesByTheme = new Map<string, typeof subthemes>()
    for (const st of subthemes) {
      const arr = subthemesByTheme.get(st.theme_code) || []
      arr.push(st)
      subthemesByTheme.set(st.theme_code, arr)
    }

    const standards: Array<{
      pillar_code: string
      pillar_name: string
      theme_code: string
      theme_name: string
      subtheme_code: string | null
      subtheme_name: string | null
      // indicators/levels intentionally omitted in fallback
    }> = []

    for (const p of pillars) {
      const ts = themesByPillar.get(p.code) || []
      for (const t of ts) {
        const sts = subthemesByTheme.get(t.code) || []
        if (sts.length === 0) {
          standards.push({
            pillar_code: p.code,
            pillar_name: p.name,
            theme_code: t.code,
            theme_name: t.name,
            subtheme_code: null,
            subtheme_name: null,
          })
        } else {
          for (const st of sts) {
            standards.push({
              pillar_code: p.code,
              pillar_name: p.name,
              theme_code: t.code,
              theme_name: t.name,
              subtheme_code: st.code,
              subtheme_name: st.name,
            })
          }
        }
      }
    }

    return NextResponse.json({
      ok: true,
      mode: 'fallback-primary-only',
      counts: {
        pillars: pillars.length,
        themes: themes.length,
        subthemes: subthemes.length,
        standards: standards.length,
      },
      standards,
    })
  } catch (e: any) {
    return err('Unexpected error in comprehensive/api/list', {
      detail: e?.message ?? String(e),
    })
  }
}
