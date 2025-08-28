// app/api/pillars/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// Helper: get last path segment (the [id])
function getIdFromUrl(request: Request) {
  const url = new URL(request.url);
  const parts = url.pathname.split('/').filter(Boolean);
  return parts[parts.length - 1]; // .../pillars/[id]
}

// PUT /api/pillars/:id -> update
export async function PUT(request: Request) {
  const id = getIdFromUrl(request);
  const body = await request.json();
  const { error } = await db.from('pillars').update(body).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

// DELETE /api/pillars/:id -> delete
export async function DELETE(request: Request) {
  const id = getIdFromUrl(request);
  const { error } = await db.from('pillars').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
