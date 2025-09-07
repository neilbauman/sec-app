// lib/supabaseClient.ts
'use client';

import { createBrowserClient } from '@supabase/ssr';

// Keep it ultra-stable for TS (avoid schema generic mismatches)
export function getBrowserClient(): any {
  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  // This is a browser-only helper. Don't call it at module scope.
  return createBrowserClient(URL, KEY);
}

// Back-compat names that some older pages might still import.
// Do not use in new code — only here so “Attempted import error” stops happening.
export const createClient = getBrowserClient;
export const getClient = getBrowserClient;
export default getBrowserClient;
