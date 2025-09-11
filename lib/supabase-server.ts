// lib/supabase-server.ts
import { cookies, type CookieOptions } from "next/headers";
import {
  createServerClient,
  type CookieOptions as SSR_CookieOptions,
} from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for Route Handlers, Server Components, and Server Actions.
 * Note: cookies() is async in your environment, so we await it.
 */
export async function createServerSupabase(): Promise<SupabaseClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const jar = await cookies(); // await -> resolves Promise<ReadonlyRequestCookies>

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return jar.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          jar.set(name, value, options as unknown as SSR_CookieOptions);
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
