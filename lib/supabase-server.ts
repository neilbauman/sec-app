// lib/supabase-server.ts
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

// Create a server-side Supabase client with cookie wrappers
export function createClient(): SupabaseClient<any> {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const store = await cookies();
          return store.get(name)?.value;
        },
        async set(name: string, value: string, options: any) {
          try {
            const store = await cookies();
            (store as any).set({ name, value, ...options });
          } catch {
            // no-op if not supported
          }
        },
        async remove(name: string, options: any) {
          try {
            const store = await cookies();
            (store as any).set({ name, value: "", ...options });
          } catch {
            // no-op
          }
        },
      },
    }
  ) as unknown as SupabaseClient<any>;
}

// Alias for compatibility
export const getSupabaseClient = createClient;
