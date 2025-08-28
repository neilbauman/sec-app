// app/api/pillars/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// GET /api/pillars  -> list all pillars
export async function GET(_request: Request) {
  const { data, error } = await db
    .from('pillars')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('code', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/pillars  -> create a pillar
// body: { code: string; name: string; statement?: string; description?: string; sort_order?: number }
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const code = (body?.code ?? '').trim();
  const name = (body?.name ?? '').trim();
  const statement = (body?.statement ?? null) || null;
  const description = (body?.description ?? null) || null;
  const sort_order = Number.isFinite(body?.sort_order) ? Number(body.sort_order) : 1;

  if (!code || !name) {
    return NextResponse.json({ error: 'code and name are required' }, { status: 400 });
  }

  const { error } = await db.from('pillars').insert({
    code, name, statement, description, sort_order
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
