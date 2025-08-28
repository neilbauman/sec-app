// app/api/standards/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// GET /api/standards?subtheme_id=...
export async function GET(request: Request) {
  const url = new URL(request.url);
  const subthemeId = url.searchParams.get('subtheme_id');
  let q = db.from('standards').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true });
  if (subthemeId) q = q.eq('subtheme_id', subthemeId);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/standards
// body: { subtheme_id, code, statement, notes?, sort_order? }
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const subtheme_id = (body?.subtheme_id ?? '').trim();
  const code = (body?.code ?? '').trim();
  const statement = (body?.statement ?? '').trim();
  const notes = (body?.notes ?? null) || null;
  const sort_order = Number.isFinite(body?.sort_order) ? Number(body.sort_order) : 1;

  if (!subtheme_id || !code || !statement) {
    return NextResponse.json({ error: 'subtheme_id, code and statement are required' }, { status: 400 });
  }

  const { error } = await db.from('standards').insert({ subtheme_id, code, statement, notes, sort_order });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
