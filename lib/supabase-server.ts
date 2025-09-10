// lib/supabase-server.ts
"use server";

import { cookies } from "next/headers";
import {
  createServerClient,
  type CookieOptions, // <- comes from @supabase/ssr, not next/headers
} from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for Route Handlers, Server Components, and Server Actions.
 * No async/await needed here; cookies() is sync in Next 15.
 */
export function createServerSupabase(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const jar = cookies(); // synchronous cookie jar

  // Note: some environments restrict set/remove; we wrap in try/catch to be safe.
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
          /* no-op outside actions/route handlers */
        }
      },
    },
  }) as unknown as SupabaseClient;
}
