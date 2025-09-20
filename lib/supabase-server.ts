// lib/supabase-server.ts
import { createServerClient, type SupabaseClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

/**
 * Create a Supabase client configured for server-side usage (API routes or RSC).
 * Uses Next.js cookies to manage authentication automatically.
 */
export function createClient(): SupabaseClient<Database> {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // no-op in RSC
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // no-op in RSC
          }
        },
      },
    }
  );
}

/** Alias to keep backwards compatibility if some files still import this */
export const getSupabaseClient = createClient;
