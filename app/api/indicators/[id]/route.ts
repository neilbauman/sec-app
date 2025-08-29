// app/api/indicators/[id]/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function PUT(req: Request, ctx: any) {
  const supabase = createClient()
  const id = ctx?.params?.id
  const body = await req.json().catch(() => ({} as any))

  const patch: any = {}
  for (const k of ['name', 'description', 'weight', 'is_default', 'code', 'sort_order']) {
    if (k in body) patch[k] = body[k]
  }

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  // If no changes, just return OK (avoids the popup).
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: true, data: null })
  }

  const { data, error } = await supabase
    .from('indicators')
    .update(patch)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true, data })
}

export async function DELETE(_req: Request, ctx: any) {
  const supabase = createClient()
  const id = ctx?.params?.id
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const { error } = await supabase.from('indicators').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
