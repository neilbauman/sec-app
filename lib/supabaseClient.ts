// /lib/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr';

// Keep these from .env (Vercel Project Settings → Environment Variables)
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Browser-only Supabase client.
 * Do NOT call at module scope. Use inside components (e.g., with useMemo).
 */
export function getBrowserClient() {
  return createBrowserClient(URL, KEY);
}
