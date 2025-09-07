import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';

export async function GET() {
  const supabase = getSupabaseServer();
  const { data: pillars } = await supabase.from('pillars').select('*').order('sort_order');
  const { data: themes } = await supabase.from('themes').select('*').order('sort_order');
  const { data: subthemes } = await supabase.from('subthemes').select('*').order('sort_order');

  return NextResponse.json([...(pillars||[]), ...(themes||[]), ...(subthemes||[])]);
}
