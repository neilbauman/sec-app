// lib/supabase-server.ts

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Create a Supabase client for server components.
 */
export async function createClient() {
  const cookieStore = await cookies(); // ✅ now explicitly awaited

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? null;
        },
        set() {
          // no-op: setting cookies doesn’t work in server components
        },
        remove() {
          // no-op: removing cookies doesn’t work in server components
        },
      },
    }
  );
}
