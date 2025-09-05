// lib/supabaseClient.ts
'use client';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Simple browser client for client components/pages.
// No SSR cookies. No session persistence (you can enable later if needed).
export function createClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Fail fast with a readable hint in the browser console
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}
