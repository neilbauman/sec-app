// app/comprehensive/api/list/route.ts
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const supabase = getServerClient()

    // quick env sanity (no secrets leaked)
    const envHints = {
      has_url: !!process.env.SUPABASE_URL,
      has_anon_key: !!process.env.SUPABASE_ANON_KEY,
      has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }

    // Pull the primary framework (same shape we used on /framework)
    const [{ data: pillars, error: pErr }, { data: themes, error: tErr }, { data: subthemes, error: sErr }] =
      await Promise.all([
        supabase.from('pillars').select('code,name,description,sort_order').order('sort_order'),
        supabase.from('themes').select('code,pillar_code,name,description,sort_order').order('sort_order'),
        supabase.from('subthemes').select('code,theme_code,name,description,sort_order').order('sort_order'),
      ])

    if (pErr) return NextResponse.json({ ok: false, stage: 'pillars', message: pErr.message, envHints }, { status: 500 })
    if (tErr) return NextResponse.json({ ok: false, stage: 'themes', message: tErr.message, envHints }, { status: 500 })
    if (sErr) return NextResponse.json({ ok: false, stage: 'subthemes', message: sErr.message, envHints }, { status: 500 })

    // Optional comprehensive tables (may not exist yet)
    const [
      { data: indicators, error: iErr },
      { data: levels, error: lErr },
    ] = await Promise.all([
      supabase
        .from('indicators')
        .select('id, owner_code, code, name, description, sort_order')
        .order('sort_order'),
      supabase
        .from('indicator_levels')
        .select('id, indicator_id, level, label, default_score, description, sort_order')
        .order('sort_order'),
    ])

    if (iErr && iErr.message?.toLowerCase().includes('relation'))
      return NextResponse.json({
        ok: false,
        stage: 'indicators',
        message: 'Table "indicators" not found (this is OK if you haven’t created it yet).',
        envHints,
      }, { status: 200 })

    if (lErr && lErr.message?.toLowerCase().includes('relation'))
      return NextResponse.json({
        ok: false,
        stage: 'indicator_levels',
        message: 'Table "indicator_levels" not found (this is OK if you haven’t created it yet).',
        envHints,
      }, { status: 200 })

    if (iErr) return NextResponse.json({ ok: false, stage: 'indicators', message: iErr.message, envHints }, { status: 500 })
    if (lErr) return NextResponse.json({ ok: false, stage: 'indicator_levels', message: lErr.message, envHints }, { status: 500 })

    return NextResponse.json({
      ok: true,
      envHints,
      counts: {
        pillars: pillars?.length ?? 0,
        themes: themes?.length ?? 0,
        subthemes: subthemes?.length ?? 0,
        indicators: indicators?.length ?? 0,
        levels: levels?.length ?? 0,
      },
      data: {
        pillars, themes, subthemes,
        indicators: indicators ?? [],
        levels: levels ?? [],
      },
    })
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      stage: 'unknown',
      message: err?.message || 'Unknown error',
      note: 'Check env keys & RLS; this endpoint uses the service role server-side.',
    }, { status: 500 })
  }
}
