// lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createClient() {
  // cookies() is async in Next.js 15+
  const cookieStorePromise = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookieStorePromise;
          return cookieStore.get(name)?.value ?? null;
        },
        set() {
          // no-op: cannot set cookies in server components
        },
        remove() {
          // no-op: cannot remove cookies in server components
        },
      },
    }
  );
}
