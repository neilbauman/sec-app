// app/framework/api/list/route.ts
import { NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read-only client (anon key). Works on server runtime for simple data fetches.
function serverSupabase(): SupabaseClient<any, any, any> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // falls back if you prefer
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function GET() {
  const supabase = serverSupabase();

  const [pillars, themes, subthemes] = await Promise.all([
    supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
    supabase.from('themes').select('*').order('sort_order', { ascending: true }),
    supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
  ]);

  // Normalise to arrays and strip nulls so the client stays simple.
  const data = {
    pillars: Array.isArray(pillars.data) ? pillars.data : [],
    themes: Array.isArray(themes.data) ? themes.data : [],
    subthemes: Array.isArray(subthemes.data) ? subthemes.data : [],
  };

  return NextResponse.json(data, { status: 200 });
}
