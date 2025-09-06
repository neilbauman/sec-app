'use client';

import { createBrowserClient } from '@supabase/ssr';

// Read from public env (already in your Vercel project settings)
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Return a browser-only Supabase client.
 * Do not call this on the server.
 */
export function getBrowserClient(): any {
  if (typeof window === 'undefined') {
    throw new Error('getBrowserClient() must be called in the browser.');
  }
  return createBrowserClient(URL, KEY);
}

// Back-compat aliases so other pages don’t break if they import differently
export default getBrowserClient;
export const createClient = getBrowserClient;
export const getSupabase = getBrowserClient;
