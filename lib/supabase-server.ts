// /lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createServerSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          const store = cookies(); // this is now async
          if ("then" in store) {
            // handle promise (Next.js 15)
            throw new Error("cookies() must be awaited in Next.js 15");
          }
          return store.get(name)?.value ?? null;
        },
        set: (_name: string, _value: string, _options: any) => {
          // no-op in SSR
        },
        remove: (_name: string, _options: any) => {
          // no-op in SSR
        },
      },
    }
  );
}
