// app/api/pillars/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// PUT /api/pillars/:id -> update a pillar
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { error } = await db.from('pillars').update({ ...body }).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

// DELETE /api/pillars/:id -> delete a pillar
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await db.from('pillars').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
