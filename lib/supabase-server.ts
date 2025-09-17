// /lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";

export function createServerClient() {
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const store = await cookies(); // ✅ must be awaited in Next.js 15
          return store.get(name)?.value ?? null;
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
