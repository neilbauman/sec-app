// lib/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Read from public envs (same ones you already have)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** A single helper you can use anywhere (server or client) */
export function getSupabase(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey);
}
