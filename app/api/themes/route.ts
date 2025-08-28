// app/api/themes/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .order('sort_order', { ascending: true, nullsFirst: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = createClient();
  const body = await req.json();

  const {
    pillar_id,
    code = '',
    name = '',
    description = '',
    sort_order = null,
  } = body || {};

  if (!pillar_id) {
    return NextResponse.json({ error: 'pillar_id is required' }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('themes')
    .insert([{
      pillar_id,
      code,
      name,
      description,
      sort_order,
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
