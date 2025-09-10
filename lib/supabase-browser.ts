// lib/supabase-browser.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createBrowserSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createBrowserClient(supabaseUrl, supabaseAnonKey) as any;
}
