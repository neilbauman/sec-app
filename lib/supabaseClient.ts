// /lib/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!URL || !KEY) {
  // Avoid throwing at import time — surfaces clearly in the browser instead
  // and prevents SSR/Build crashes. Pages should still be client-only.
  console.warn('Supabase env vars are missing: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export function getBrowserClient(): SupabaseClient<any> {
  // Must only be called in the browser — pages using this are client components
  return createBrowserClient(URL || '', KEY || '');
}

// Back-compat (do NOT use anywhere new):
export const createClient = undefined as unknown as never;
export const createBrowserClientCompat = undefined as unknown as never;
