// /lib/supabaseClient.ts
'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Returns a Supabase client configured for the browser.
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in env.
 */
export function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !anon) {
    // Fail loudly so it's clear in the browser console/env if misconfigured
    console.error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return createBrowserClient(url, anon);
}

// Export as default AND named, so both import styles work.
export default getBrowserClient;
