// lib/supabase-client.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Universal Supabase client (safe for Pages Router).
 * Future-proof: if you migrate to App Router, add a supabase-server.ts separately.
 */
export function getSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
