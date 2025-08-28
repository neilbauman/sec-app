// app/api/standards/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('standards')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('code', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const supabase = createClient();
  const body = await req.json();
  const payload = {
    subtheme_id: body.subtheme_id,
    code: body.code ?? null,
    description: body.description ?? '',  // CHANGED
    notes: body.notes ?? null,
    sort_order: body.sort_order ?? null,
  };

  const { data, error } = await supabase.from('standards').insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
