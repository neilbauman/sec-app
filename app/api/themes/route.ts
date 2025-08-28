// app/api/themes/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// GET /api/themes -> list all themes (optionally filter by pillar_id)
export async function GET(request: Request) {
  const url = new URL(request.url);
  const pillarId = url.searchParams.get('pillar_id');

  let q = db.from('themes').select('*').order('sort_order', { ascending: true }).order('code', { ascending: true });
  if (pillarId) q = q.eq('pillar_id', pillarId);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/themes -> create a theme
// body: { pillar_id: string; code: string; name: string; statement?: string; description?: string; sort_order?: number }
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const pillar_id = (body?.pillar_id ?? '').trim();
  const code = (body?.code ?? '').trim();
  const name = (body?.name ?? '').trim();
  const statement = (body?.statement ?? null) || null;
  const description = (body?.description ?? null) || null;
  const sort_order = Number.isFinite(body?.sort_order) ? Number(body.sort_order) : 1;

  if (!pillar_id || !code || !name) {
    return NextResponse.json({ error: 'pillar_id, code and name are required' }, { status: 400 });
  }

  const { error } = await db.from('themes').insert({ pillar_id, code, name, statement, description, sort_order });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
