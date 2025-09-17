// /lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Create a Supabase client that works with Next.js 13+/15
 * on the server side. It passes the Next.js cookies store
 * into Supabase so auth/session works properly.
 */
export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
        set() {
          // no-op during SSR
        },
        remove() {
          // no-op during SSR
        },
      },
    }
  );
}
