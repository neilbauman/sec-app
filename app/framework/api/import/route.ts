import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';
import Papa from 'papaparse';

export async function POST(req: Request) {
  const supabase = getSupabaseServer();
  const text = await req.text();
  const parsed = Papa.parse(text, { header: true });
  const rows = parsed.data as any[];
  const { error } = await supabase.from('pillars').insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
