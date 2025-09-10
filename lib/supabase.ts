// lib/supabase.ts
import { cookies } from "next/headers";
import {
  createServerClient,
  createBrowserClient,
  type SupabaseClient,
  type CookieOptions,
} from "@supabase/ssr";

/**
 * Browser client (use inside Client Components/hooks).
 * We cast to plain SupabaseClient to avoid GenericSchema vs "public" constraints from Vercel’s type env.
 */
export function createClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createBrowserClient(supabaseUrl, supabaseAnonKey) as unknown as SupabaseClient;
}

/**
 * Server client (use inside Route Handlers, Server Components, and Server Actions).
 * No type import of ReadonlyRequestCookies; we just use the runtime `cookies()` API.
 */
export function createClientOnServer(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const jar = cookies(); // Next 15: sync accessor

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return jar.get(name)?.value;
      },
      // `set`/`remove` work inside server actions/route handlers; they’re no-ops elsewhere.
      set(name: string, value: string, options: CookieOptions) {
        try {
          jar.set(name, value, options);
        } catch {
          /* ignore when not allowed in this context */
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          jar.set(name, "", { ...options, maxAge: 0 });
        } catch {
          /* ignore when not allowed in this context */
        }
      },
    },
  }) as unknown as SupabaseClient;
}
