// /lib/supabase-server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export function createClient() {
  const cookieStore = cookies() as unknown as ReadonlyRequestCookies;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          // ReadonlyRequestCookies doesn’t support .set()
          // For now we no-op to satisfy type
          return;
        },
        remove: (name: string, options: any) => {
          // Same here – you’ll typically handle this client-side or via middleware
          return;
        },
      },
    }
  );
}
