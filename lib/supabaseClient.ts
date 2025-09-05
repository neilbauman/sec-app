// /lib/supabaseClient.ts
import { createClient as _createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * A single browser client instance. Using a singleton prevents
 * multiple clients/sessions from being created on re-renders.
 */
let _browserClient: SupabaseClient | null = null;

/** Get (or create) a browser-side Supabase client */
export function getBrowserClient(): SupabaseClient {
  if (_browserClient) return _browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !anon) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  _browserClient = _createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  return _browserClient;
}

/**
 * Back-compat export used by your pages.
 * (Both pages can import { createClient } from '@/lib/supabaseClient')
 */
export const createClient = getBrowserClient;
