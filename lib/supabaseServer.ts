// lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!URL || !ANON) {
  // Fail fast with a clear message in server logs
  console.error('Missing Supabase env vars. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
}

export function getServerClient() {
  // Server-only client; do NOT import this from client components
  return createClient(URL, ANON, {
    auth: { persistSession: false },
  });
}
