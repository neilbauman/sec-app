// lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function createServerSupabase(): Promise<SupabaseClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // In Next 15, cookies() may be typed as Promise in some environments — await it.
  const jar = await cookies();

  // Adapter: implement get/set/remove as expected by @supabase/ssr.
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return jar.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        // In some contexts (outside server actions/route handlers), set/remove are restricted.
        // Wrap in try/catch so build doesn’t fail and runtime doesn’t throw.
        try {
          // Next API: jar.set(name, value, options)
          (jar as any).set?.(name, value, options as any);
        } catch {
          /* no-op */
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          // Clear via set + maxAge: 0
          (jar as any).set?.(name, "", { ...(options as any), maxAge: 0 });
        } catch {
          /* no-op */
        }
      },
    },
  }) as unknown as SupabaseClient;
}
