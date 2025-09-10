// lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for Route Handlers, Server Components, and Server Actions.
 * Note: cookies() can be awaited in some Next versions; we normalize by awaiting here.
 * We provide no-op set/remove to avoid build errors in non-action contexts.
 */
export async function createServerSupabase(): Promise<SupabaseClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const jar = await cookies(); // returns ReadonlyRequestCookies in your env

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return jar.get(name)?.value;
      },
      set(_name: string, _value: string, _options: CookieOptions) {
        // no-op outside actions/route handlers
      },
      remove(_name: string, _options: CookieOptions) {
        // no-op outside actions/route handlers
      },
    },
  }) as unknown as SupabaseClient;
}
