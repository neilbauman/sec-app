// app/comprehensive/api/list/route.ts
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

type Pillar = {
  code: string
  name: string | null
  description: string | null
  sort_order: number | null
}

type Theme = {
  code: string
  pillar_code: string
  name: string | null
  description: string | null
  sort_order: number | null
}

type Subtheme = {
  code: string
  theme_code: string
  name: string | null
  description: string | null
  sort_order: number | null
}

export async function GET() {
  // Basic env sanity check (service role is required on the server)
  const hasUrl = !!process.env.SUPABASE_URL
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!hasUrl || !hasServiceKey) {
    return NextResponse.json(
      {
        ok: false,
        stage: 'env',
        message:
          'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (server-side)',
      },
      { status: 500 }
    )
  }

  const supabase = getServerClient()

  // ---- Pillars
  const { data: pillars, error: pillarsErr } = await supabase
    .from('pillars')
    .select('code,name,description,sort_order')
    .order('sort_order', { ascending: true })
    .limit(10000)

  if (pillarsErr) {
    return NextResponse.json(
      { ok: false, stage: 'pillars', message: pillarsErr.message },
      { status: 500 }
    )
  }

  // ---- Themes
  const { data: themes, error: themesErr } = await supabase
    .from('themes')
    .select('code,pillar_code,name,description,sort_order')
    .order('sort_order', { ascending: true })
    .limit(10000)

  if (themesErr) {
    return NextResponse.json(
      { ok: false, stage: 'themes', message: themesErr.message },
      { status: 500 }
    )
  }

  // ---- Subthemes
  const { data: subthemes, error: subthemesErr } = await supabase
    .from('subthemes')
    .select('code,theme_code,name,description,sort_order')
    .order('sort_order', { ascending: true })
    .limit(10000)

  if (subthemesErr) {
    return NextResponse.json(
      { ok: false, stage: 'subthemes', message: subthemesErr.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    ok: true,
    pillars: (pillars ?? []) as Pillar[],
    themes: (themes ?? []) as Theme[],
    subthemes: (subthemes ?? []) as Subtheme[],
    totals: {
      pillars: pillars?.length ?? 0,
      themes: themes?.length ?? 0,
      subthemes: subthemes?.length ?? 0,
    },
  })
}
