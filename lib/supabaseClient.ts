// lib/supabaseClient.ts
// Client-only Supabase helper (no server usage here)

import { createBrowserClient } from '@supabase/ssr';

// NOTE: we intentionally avoid strict typing here to prevent schema generic
// mismatches during CI builds. Keep this simple and stable.
export function getBrowserClient() {
  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  // This must ONLY be called from client components
  return createBrowserClient(URL, KEY);
}
