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
        get(name: string) {
          return cookies().get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            // Next.js cookies().set is only available in middleware / server actions
            (cookies() as any).set({ name, value, ...options });
          } catch {
            // no-op if not supported in this context
          }
        },
        remove(name: string, options: any) {
          try {
            (cookies() as any).set({ name, value: "", ...options });
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
