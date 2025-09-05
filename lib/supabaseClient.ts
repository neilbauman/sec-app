// lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * Browser-side singleton. Uses the standard NEXT_PUBLIC_* env vars.
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    if (!url || !anon) throw new Error('Missing Supabase env vars');
    client = createClient(url, anon, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return client;
}
