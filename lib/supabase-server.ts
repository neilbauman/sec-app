// lib/supabase-server.ts
import { cookies, type CookieOptions } from "next/headers";
import {
  createServerClient,
  type CookieOptions as SSR_CookieOptions, // not all versions export this; keep ours above
} from "@supabase/ssr";

// Keep types very permissive to avoid “GenericSchema vs 'public'” build errors on Vercel.
// Consumers shouldn't re-export these types; just use the returned client.
export function createServerSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // In Next 15, cookies() is sync and returns a jar with .get/.set
  const jar = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return jar.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        // This is allowed in route handlers/server actions. Elsewhere it’s a no-op.
        jar.set(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        jar.set(name, "", { ...options, maxAge: 0 });
      },
    },
  }) as any; // keep loose to avoid schema generic narrowing issues on Vercel
}
