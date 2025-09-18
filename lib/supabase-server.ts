// /lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const store = await cookies(); // ✅ Await it once
          return store.get(name)?.value ?? null;
        },
        async set(name: string, value: string, options: any) {
          // No-op on server; handled by middleware if needed
          return;
        },
        async remove(name: string, options: any) {
          // No-op on server
          return;
        },
      },
    }
  );
}
