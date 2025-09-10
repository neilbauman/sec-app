import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Keep this a plain function that just returns a client.
// Do NOT mark it async. Do NOT import Supabase types.
export function createClientOnServer() {
  const jar = cookies(); // Next 15 cookies() is sync

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return jar.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // In server routes/actions, this is allowed; elsewhere it's a no-op
          jar.set(name, value, options as any);
        },
        remove(name: string, options: CookieOptions) {
          jar.set(name, '', { ...(options as any), maxAge: 0 });
        },
      },
    }
  );
}
