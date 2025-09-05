// lib/supabaseClient.ts
import { createClient as createSb } from '@supabase/supabase-js';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createSb(url, key, {
    auth: { persistSession: false },
  });
}
