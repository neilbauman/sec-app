// lib/supabase-server.ts
"use server";

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client (Route Handlers, Server Components, Server Actions).
 * Note: async on purpose so we can `await cookies()` in environments where it's promise-typed.
 */
export async function createClientOnServer(): Promise<SupabaseClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // In some runtimes/types, cookies() is promise-typed — await to satisfy TS.
  const jar = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return jar.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          // set can be a no-op in some contexts; try/catch prevents build errors.
          jar.set({ name, value, ...options });
        } catch {}
      },
      remove(name: string, options: CookieOptions) {
        try {
          jar.set({ name, value: "", ...options, maxAge: 0 });
        } catch {}
      },
    },
  }) as unknown as SupabaseClient;
}
