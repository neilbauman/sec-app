// app/framework/api/list/route.ts
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabaseServer' // your existing helper

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createServerClient()

  const { data: pillars = [], error: pErr } = await supabase
    .from('pillars')
    .select('code,name,description,sort_order')
    .order('sort_order', { ascending: true })

  const { data: themes = [], error: tErr } = await supabase
    .from('themes')
    .select('code,pillar_code,name,description,sort_order')
    .order('sort_order', { ascending: true })

  const { data: subthemes = [], error: sErr } = await supabase
    .from('subthemes')
    .select('code,theme_code,name,description,sort_order')
    .order('sort_order', { ascending: true })

  const body = {
    ok: !(pErr || tErr || sErr),
    pillars, themes, subthemes,
    totals: { pillars: pillars.length, themes: themes.length, subthemes: subthemes.length }
  }

  const res = NextResponse.json(body)
  // Kill any caching so the client always sees latest
  res.headers.set('Cache-Control', 'no-store, max-age=0')
  return res
}
