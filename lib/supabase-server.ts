// /lib/supabase-server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => {
          const store = await cookies(); // ✅ must await
          return store.get(name)?.value ?? null;
        },
        set: async () => {
          // no-op in SSR
        },
        remove: async () => {
          // no-op in SSR
        },
      },
    }
  );
}
