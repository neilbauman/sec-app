// lib/supabase-client.ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

// Create a plain Supabase client (useful in edge or neutral contexts)
export function getSupabaseClient(): SupabaseClient<any> {
  return createSupabaseClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
