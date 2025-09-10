// lib/supabase.ts
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function createClientOnServer(): Promise<SupabaseClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Next 15: cookies() can be async — await it once, reuse the store.
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: Parameters<typeof cookieStore.set>[2]) {
        cookieStore.set(name, value, options);
      },
      remove(name: string, options: Parameters<typeof cookieStore.set>[2]) {
        cookieStore.set(name, '', { ...options, maxAge: 0 });
      },
    },
  });
}
