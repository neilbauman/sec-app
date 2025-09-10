// lib/supabase.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
// Optional: you can keep this import for editor help, but we won’t over-annotate generics.
import type { SupabaseClient } from "@supabase/supabase-js";

export function createClient(): SupabaseClient {
  const cookieStore = cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Let the helper infer schema types; avoid hard-coding "public" generics
  const client = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // In some Next runtimes cookies() is read-only; swallow set/remove if not allowed
      set(name: string, value: string, options: CookieOptions) {
        try {
          // @ts-ignore: Next 15 types can mark this as readonly outside actions/handlers
          cookieStore.set({ name, value, ...options });
        } catch {}
      },
      remove(name: string, options: CookieOptions) {
        try {
          // @ts-ignore
          cookieStore.set({ name, value: "", ...options });
        } catch {}
      },
    },
  });

  // Cast to generic SupabaseClient to keep call sites happy without schema literals
  return client as unknown as SupabaseClient;
}
