// app/framework/api/list/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Keep this API route server-only.
export const runtime = 'nodejs';

// We do a simple read of pillars/themes/subthemes in sort_order.
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { error: 'Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)' },
      { status: 500 }
    );
  }

  const supabase = createClient(url, key);

  // Fetch all three tables independently (no RPC, no joins for simplicity)
  const [pillarsRes, themesRes, subthemesRes] = await Promise.all([
    supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
    supabase.from('themes').select('*').order('sort_order', { ascending: true }),
    supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
  ]);

  // If any error occurs, return it (keeps client-side simple)
  if (pillarsRes.error) return NextResponse.json({ error: pillarsRes.error.message }, { status: 500 });
  if (themesRes.error) return NextResponse.json({ error: themesRes.error.message }, { status: 500 });
  if (subthemesRes.error) return NextResponse.json({ error: subthemesRes.error.message }, { status: 500 });

  return NextResponse.json({
    pillars: pillarsRes.data ?? [],
    themes: themesRes.data ?? [],
    subthemes: subthemesRes.data ?? [],
  });
}
