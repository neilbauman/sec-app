// app/api/indicators/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function PUT(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const id = params.id;
  const body = await _req.json();

  const {
    name,
    description,
    is_default,
    pillar_id,
    theme_id,
    subtheme_id,
    standard_id,
    sort_order,
    code,
    weight,
  } = body || {};

  const { data, error } = await supabase
    .from('indicators')
    .update({
      ...(name !== undefined ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(is_default !== undefined ? { is_default } : {}),
      ...(pillar_id !== undefined ? { pillar_id } : {}),
      ...(theme_id !== undefined ? { theme_id } : {}),
      ...(subtheme_id !== undefined ? { subtheme_id } : {}),
      ...(standard_id !== undefined ? { standard_id } : {}),
      ...(sort_order !== undefined ? { sort_order } : {}),
      ...(code !== undefined ? { code } : {}),
      ...(weight !== undefined ? { weight } : {}),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const id = params.id;
  const { error } = await supabase.from('indicators').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
