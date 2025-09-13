// lib/supabase-server.ts
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Create a Supabase client for server components.
 */
export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies(); // 👈 must await since it's async in Next 15

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

  // Cast to SupabaseClient to avoid schema mismatch errors
  return client as unknown as SupabaseClient;
}
