// lib/supabase.ts
import { createBrowserClient } from "@supabase/ssr";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Use inside Client Components/hooks */
export function getBrowserSupabase(): SupabaseClient {
  return createBrowserClient(supabaseUrl, supabaseAnonKey) as unknown as SupabaseClient;
}

/** Use inside Server Components, Route Handlers, and Server Actions */
export function getServerSupabase(): SupabaseClient {
  // In Next 15, cookies() is sync and safe here.
  const jar = cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return jar.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        jar.set(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        jar.set(name, "", { ...options, maxAge: 0 });
      },
    },
  }) as unknown as SupabaseClient;
}
