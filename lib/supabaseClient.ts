// /lib/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Returns a browser Supabase client.
 * - Must ONLY be called in the browser (pages using this are client components).
 * - We intentionally keep the return type loose to avoid schema-generic mismatches
 *   that caused the Vercel build error.
 */
export function getBrowserClient(): SupabaseClient<any> {
  if (typeof window === 'undefined') {
    throw new Error('getBrowserClient() must be called in the browser.');
  }
  // Return type is intentionally loose to avoid "GenericSchema" vs "public" mismatch
  return createBrowserClient(URL || '', KEY || '') as unknown as SupabaseClient<any>;
}

// Back-compat: do not import default anywhere new.
export default getBrowserClient;
