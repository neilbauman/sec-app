// app/api/indicators/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('indicators')
    .select('*')
    .order('sort_order', { ascending: true, nullsFirst: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = createClient();
  const body = await req.json();

  const {
    name,
    description = null,
    is_default = false,
    pillar_id = null,
    theme_id = null,
    subtheme_id = null,
    standard_id = null,
    sort_order = null,
    code = null,
    weight = null,
  } = body || {};

  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  // Exactly one of these links should be set for default indicators at a level
  // (pillar_id | theme_id | subtheme_id) — standard_id is for non-default, standard-level indicators.
  const { data, error } = await supabase
    .from('indicators')
    .insert([{
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
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
