// lib/supabaseClient.ts
// Minimal, browser-only Supabase client for App Router pages.
// No server helpers, no generics — keeps Vercel builds happy.

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createBrowserClient(url, key);
}

export default createClient;
