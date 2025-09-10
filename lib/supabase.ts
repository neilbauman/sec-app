// lib/supabase.ts
import { cookies, type ReadonlyRequestCookies } from "next/headers";
import {
  createServerClient,
  createBrowserClient,
  type CookieOptions,
} from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// IMPORTANT: keep these envs in .env.local (already present in your app)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Client for browser components/hooks */
export function createClient(): SupabaseClient {
  // Casting to plain SupabaseClient avoids “GenericSchema vs 'public'” constraints
  return createBrowserClient(supabaseUrl, supabaseAnonKey) as unknown as SupabaseClient;
}

/** Client for server routes / server components / server actions (Next 15-safe) */
export async function createClientOnServer(): Promise<SupabaseClient> {
  // Next 15: cookies() is async in many server contexts
  const jar: ReadonlyRequestCookies = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return jar.get(name)?.value;
      },
      // set/remove are no-ops unless you're in a Server Action or Route Handler.
      // Keeping them defined satisfies @supabase/ssr’s adapter contract.
      set(_name: string, _value: string, _options: CookieOptions) {
        // noop (or implement only inside actual Server Actions)
      },
      remove(_name: string, _options: CookieOptions) {
        // noop
      },
    },
  }) as unknown as SupabaseClient;
}
