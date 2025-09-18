// /lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// This is the ONLY export we’ll use app-wide
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          return cookieStore.get(name)?.value ?? null;
        },
        set: (_name: string, _value: string, _options: any) => {
          // No-op in SSR
        },
        remove: (_name: string, _options: any) => {
          // No-op in SSR
        },
      },
    }
  );
}
