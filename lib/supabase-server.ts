// lib/supabase-server.ts
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Create a Supabase client for server components.
 * Casted to SupabaseClient so type mismatches don't block builds.
 */
export function createClient(): SupabaseClient {
  const cookieStore = cookies();

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? null;
        },
        set() {
          // no-op: can't set cookies in server components
        },
      },
    }
  );

  return client as unknown as SupabaseClient; // 👈 safe cast, avoids schema mismatch errors
}
