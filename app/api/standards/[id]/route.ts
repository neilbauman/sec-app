// app/api/standards/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function PUT(req: Request, { params }: any) {
  const { id } = params;
  const supabase = createClient();
  const body = await req.json();
  const patch = {
    code: body.code ?? null,
    description: body.description ?? null, // CHANGED
    notes: body.notes ?? null,
    sort_order: body.sort_order ?? null,
  };

  const { data, error } = await supabase.from('standards').update(patch).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: any) {
  const { id } = params;
  const supabase = createClient();
  const { error } = await supabase.from('standards').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
