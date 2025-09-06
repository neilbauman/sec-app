// lib/supabaseClient.ts
import { createBrowserClient, type SupabaseClient } from '@supabase/ssr';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Named export we will use everywhere
export function getBrowserClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    // Never construct the browser client on the server/prerender
    throw new Error('getBrowserClient() must be called in the browser.');
  }
  return createBrowserClient(URL, KEY);
}

// Back-compat (do not use, but leaving here prevents old imports from crashing)
export default getBrowserClient;
