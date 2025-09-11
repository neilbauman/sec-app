// lib/supabase-server.ts
"use server";

import { cookies } from "next/headers";
import {
  createServerClient,
  type CookieOptions,
  type SupabaseClient,
} from "@supabase/ssr";

/**
 * Server-side Supabase client for Route Handlers, Server Components, and Server Actions.
 * Works with Next 15 where cookies() is async-typed.
 */
export async function createServerSupabase(): Promise<SupabaseClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const jar = await cookies(); // await the cookie store

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return jar.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          // In server actions/route handlers this is allowed; elsewhere it may be a no-op
          (jar as any).set(name, value, options as any);
        } catch {
          /* noop */
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          (jar as any).set(name, "", { ...(options as any), maxAge: 0 });
        } catch {
          /* noop */
        }
      },
    },
  }) as unknown as SupabaseClient;
}
