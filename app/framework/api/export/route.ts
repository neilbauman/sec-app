import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';
import Papa from 'papaparse';

export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase.from('pillars').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const csv = Papa.unparse(data || []);
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv' } });
}
