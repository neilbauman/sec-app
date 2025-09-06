// lib/supabaseClient.ts
// A compatibility layer so pages can import getBrowserClient, createClient, or default.

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function getBrowserClient(): SupabaseClient {
  // This must only run in the browser; pages should guard or be 'use client'
  return createBrowserClient(URL, KEY);
}

// Back-compat aliases
export const createClient = getBrowserClient;
export const createBrowserClientCompat = getBrowserClient;

// Default export for imports like: import createClient from '@/lib/supabaseClient'
export default getBrowserClient;
