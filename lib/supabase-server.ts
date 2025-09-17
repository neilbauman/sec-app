// /lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

export function createServerClient() {
  const cookieStore = cookies(); // ✅ This is a synchronous object, not a Promise

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // no-op during SSR
        },
        remove(name: string, options: any) {
          // no-op during SSR
        },
      },
    }
  );
}
