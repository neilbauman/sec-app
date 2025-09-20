// lib/supabase-server.ts
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

// Safe, loose typing to avoid generic mismatches
export function createClient(): SupabaseClient<any> {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  ) as unknown as SupabaseClient<any>;
}

// Keeping this alias for compatibility with existing imports
export const getSupabaseClient = createClient;
