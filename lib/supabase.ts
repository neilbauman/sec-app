// lib/supabase.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '@/types/supabase'; // if you don’t have this yet, you can remove the generic <Database>

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        get(name: string) {
          // When running on the server without a request context, just return undefined.
          // We aren't relying on cookies for public reads in the editor page.
          return undefined as unknown as string | undefined;
        },
        set(_name: string, _value: string, _options: CookieOptions) {
          // no-op for server actions we’re not using yet
        },
        remove(_name: string, _options: CookieOptions) {
          // no-op
        },
      },
    }
  );
}
