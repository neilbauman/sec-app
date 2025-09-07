import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  const supabase = getSupabaseServer();
  const { table, id } = await req.json();
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
