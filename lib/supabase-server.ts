// /lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

// Wrapper to consistently create a Supabase client in server components
export function createServerClient() {
  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
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
