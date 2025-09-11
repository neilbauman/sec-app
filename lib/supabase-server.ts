// lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Synchronous in Next 15 – returns a SupabaseClient (NOT a Promise) */
export function createServerSupabase(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const jar = cookies(); // sync cookie jar

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return jar.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          jar.set(name, value, options as any);
        } catch {
          /* no-op outside actions/route handlers */
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          jar.set(name, "", { ...(options as any), maxAge: 0 });
        } catch {
          /* no-op */
        }
      },
    },
  }) as unknown as SupabaseClient;
}
