// /lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";

export function createServerClient() {
  const cookieStore = cookies();

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? null;
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
