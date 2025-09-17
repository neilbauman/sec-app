// /lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";

export const createServerSupabase = async () => {
  // ✅ Await cookies() because in your Next.js version it returns a Promise
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // SSR no-op during build
          return;
        },
        remove(name: string, options: any) {
          // SSR no-op during build
          return;
        },
      },
    }
  );
};
