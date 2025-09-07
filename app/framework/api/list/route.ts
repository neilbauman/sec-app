// app/framework/api/list/route.ts
import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabaseServer';

/**
 * GET /framework/api/list
 * Returns { pillars: any[], themes: any[], subthemes: any[] }
 * Non-fatal on individual table errors – returns empty arrays with warnings.
 */
export async function GET() {
  const supabase = getServerClient();

  const [pillarsRes, themesRes, subRes] = await Promise.all([
    supabase.from('pillars').select('*').order('id', { ascending: true }),
    supabase.from('themes').select('*').order('id', { ascending: true }),
    supabase.from('subthemes').select('*').order('id', { ascending: true }),
  ]);

  const errors: string[] = [];
  if (pillarsRes.error) errors.push(`pillars: ${pillarsRes.error.message}`);
  if (themesRes.error) errors.push(`themes: ${themesRes.error.message}`);
  if (subRes.error) errors.push(`subthemes: ${subRes.error.message}`);

  return NextResponse.json(
    {
      ok: errors.length === 0,
      errors,
      pillars: pillarsRes.data ?? [],
      themes: themesRes.data ?? [],
      subthemes: subRes.data ?? [],
    },
    { status: errors.length ? 207 /* Multi-Status */ : 200 }
  );
}
