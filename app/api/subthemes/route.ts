// app/api/subthemes/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// GET /api/subthemes?theme_id=...
export async function GET(request: Request) {
  const url = new URL(request.url);
  const themeId = url.searchParams.get('theme_id');
  let q = db.from('subthemes').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true });
  if (themeId) q = q.eq('theme_id', themeId);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/subthemes
// body: { theme_id, code, name, statement?, description?, sort_order? }
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const theme_id = (body?.theme_id ?? '').trim();
  const code = (body?.code ?? '').trim();
  const name = (body?.name ?? '').trim();
  const statement = (body?.statement ?? null) || null;
  const description = (body?.description ?? null) || null;
  const sort_order = Number.isFinite(body?.sort_order) ? Number(body.sort_order) : 1;

  if (!theme_id || !code || !name) {
    return NextResponse.json({ error: 'theme_id, code and name are required' }, { status: 400 });
  }

  const { error } = await db.from('subthemes').insert({ theme_id, code, name, statement, description, sort_order });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
