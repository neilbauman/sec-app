// app/api/indicators/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  const supabase = createClient()
  const body = await req.json()

  const { code, name, description, pillar_id, theme_id, subtheme_id, standard_id } = body

  if (![pillar_id, theme_id, subtheme_id, standard_id].some(Boolean)) {
    return NextResponse.json({ error: 'Provide one parent id' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('indicators')
    .insert([{
      code,
      name,
      description,
      pillar_id,
      theme_id,
      subtheme_id,
      standard_id
    }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true, data })
}
