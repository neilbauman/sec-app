// /lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

// ⚠️ Do NOT make this function async
export function createServerClient() {
  // ✅ cookies() is synchronous
  const cookieStore = cookies();

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? null;
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
