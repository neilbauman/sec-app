// app/framework/api/list/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper: count rows without loading full tables
async function countRows(supabase: any, table: string) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  return { count: count ?? 0, error: error?.message };
}

// Helper: sample a few rows to confirm shape (no edits)
async function sampleRows(supabase: any, table: string, n = 3) {
  const { data, error } = await supabase.from(table).select('*').limit(n);
  return { sample: data ?? [], error: error?.message };
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const env = {
    has_url: Boolean(URL),
    has_anon_key: Boolean(ANON),
    has_service_key: Boolean(SERVICE),
  };

  const supabase = createClient(URL, SERVICE || ANON, { auth: { persistSession: false } });

  // Change table names here ONLY if your schema uses different names
  const tableNames = {
    pillars: 'pillars',
    themes: 'themes',
    subthemes: 'subthemes',
  };

  const results: any = { env, tables: {} };

  // Do counts + small samples, and return any DB error messages inline
  for (const [alias, table] of Object.entries(tableNames)) {
    const [c, s] = await Promise.all([
      countRows(supabase, table),
      sampleRows(supabase, table),
    ]);
    results.tables[alias] = { ...c, ...s };
  }

  // Minimal payload the current page expects, but now with “debug” too
  const resp = {
    ok: true,
    debug: results,
    // Keep these arrays for the existing page (it just uses .length)
    pillars: results.tables.pillars?.sample ?? [],
    themes: results.tables.themes?.sample ?? [],
    subthemes: results.tables.subthemes?.sample ?? [],
  };

  return NextResponse.json(resp);
}
