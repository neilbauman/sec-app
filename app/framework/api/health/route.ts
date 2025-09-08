// app/framework/api/health/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const env = {
    has_url: Boolean(URL),
    has_anon_key: Boolean(ANON),
    has_service_key: Boolean(SERVICE),
  };

  // Use service key if available (server-only), otherwise anon
  const supabase = createClient(URL, SERVICE || ANON, { auth: { persistSession: false } });

  // A harmless ping: list schemas (works if the key is valid & project reachable)
  let pingOk = false;
  let pingError: string | undefined = undefined;
  try {
    // Do a super-light query against a known table name you have (pillars).
    const { error } = await supabase.from('pillars').select('*', { count: 'exact', head: true });
    pingOk = !error;
    if (error) pingError = error.message;
  } catch (e: any) {
    pingError = e?.message || String(e);
  }

  return NextResponse.json({ ok: true, env, pingOk, pingError });
}
