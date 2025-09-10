// lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for Route Handlers, Server Components, and Server Actions.
 * NOTE: Do NOT add `"use server"` here. This is a plain helper, not an action.
 */
export function createServerSupabase(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const jar = cookies(); // synchronous in Next 15

  // Some runtimes only allow set/remove in server actions/route handlers.
  // We wrap in try/catch so it’s safe everywhere.
  const client = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return jar.get(name)?.value;
      },
      set(name: string, value: string, options?: unknown) {
        try {
          // @ts-expect-error - Next's cookies() types vary by version; this is safe at runtime.
          jar.set(name, value, options);
        } catch {
          /* no-op outside actions/route handlers */
        }
      },
      remove(name: string, options?: unknown) {
        try {
          // emulate remove via set with maxAge=0
          // @ts-expect-error - type leniency for cross-version compatibility
          jar.set(name, "", { ...(options as any), maxAge: 0 });
        } catch {
          /* no-op outside actions/route handlers */
        }
      },
    },
  });

  // Cast to the stable SupabaseClient from @supabase/supabase-js
  return client as unknown as SupabaseClient;
}
