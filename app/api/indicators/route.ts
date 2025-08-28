// app/api/indicators/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// GET /api/indicators?pillar_id=&theme_id=&subtheme_id=&standard_id=
export async function GET(request: Request) {
  const url = new URL(request.url);
  const pillar_id = url.searchParams.get('pillar_id');
  const theme_id = url.searchParams.get('theme_id');
  const subtheme_id = url.searchParams.get('subtheme_id');
  const standard_id = url.searchParams.get('standard_id');

  let q = db.from('indicators').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true });
  if (pillar_id) q = q.eq('pillar_id', pillar_id);
  if (theme_id) q = q.eq('theme_id', theme_id);
  if (subtheme_id) q = q.eq('subtheme_id', subtheme_id);
  if (standard_id) q = q.eq('standard_id', standard_id);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/indicators
// body: { code?, name, description?, weight?, is_default?, sort_order?, pillar_id|theme_id|subtheme_id|standard_id (exactly one) }
export async function POST(request: Request) {
  const b = await request.json().catch(() => ({}));
  const name = (b?.name ?? '').trim();
  const parentKeys = ['pillar_id','theme_id','subtheme_id','standard_id'] as const;
  const parentProvided = parentKeys.filter(k => b?.[k]);
  if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  if (parentProvided.length !== 1) return NextResponse.json({ error: 'provide exactly one parent id' }, { status: 400 });

  const insert = {
    code: b?.code?.trim() || null,
    name,
    description: b?.description?.trim() || null,
    weight: Number.isFinite(b?.weight) ? Number(b.weight) : null,
    is_default: Boolean(b?.is_default),
    sort_order: Number.isFinite(b?.sort_order) ? Number(b.sort_order) : 1,
    pillar_id: null as string | null,
    theme_id: null as string | null,
    subtheme_id: null as string | null,
    standard_id: null as string | null
  };
  (insert as any)[parentProvided[0]] = b[parentProvided[0]];

  const { error } = await db.from('indicators').insert(insert);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
