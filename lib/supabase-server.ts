// /lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

export function createServerClient() {
  // ✅ cookies() is synchronous, no async/await
  const cookieStore = cookies();

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value ?? null,
        set: (_name: string, _value: string, _options: any) => {
          /* no-op during SSR */
        },
        remove: (_name: string, _options: any) => {
          /* no-op during SSR */
        },
      },
    }
  );
}
