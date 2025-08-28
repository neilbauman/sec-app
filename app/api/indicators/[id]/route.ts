// app/api/indicators/[id]/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const id = params.id
  const body = await req.json().catch(() => ({} as any))

  // allow partial updates; only whitelist supported columns
  const patch: any = {}
  for (const k of ['name','description','weight','is_default','code','sort_order']) {
    if (k in body) patch[k] = body[k]
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
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

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { error } = await supabase.from('indicators').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
