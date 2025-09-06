// lib/supabaseClient.ts
import { createClient as _createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * A tiny, stable, browser-only singleton.
 * Works on Vercel without @supabase/ssr and supports BOTH named and default imports.
 * Use anywhere in client components: const supabase = getBrowserClient();
 */
let _browserClient: SupabaseClient | null = null;

function _make(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return _createClient(url, key);
}

export function getBrowserClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    // This page uses client components; avoid accidental server usage.
    throw new Error('getBrowserClient() must be called in the browser.');
  }
  if (_browserClient) return _browserClient;
  _browserClient = _make();
  return _browserClient;
}

// Compatibility aliases so imports NEVER break again:
export const createBrowserClient = getBrowserClient;
export const createClient = getBrowserClient;
export default getBrowserClient;
