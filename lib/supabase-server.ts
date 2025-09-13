// lib/supabase-server.ts
import { createServerClient, type SupabaseClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Create a Supabase client for server components.
 * Loosened typing so we don’t clash with Supabase's GenericSchema vs "public".
 * Later, you can switch to a generated Database type for stricter safety.
 */
export function createClient(): SupabaseClient {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? null;
        },
        set() {
          // no-op: server components can’t set cookies
        },
      },
    }
  ) as SupabaseClient; // 👈 loosened type to bypass "GenericSchema" mismatch
}
