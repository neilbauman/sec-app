// /lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createServerSupabase() {
  // ✅ Await once
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value ?? null,
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
