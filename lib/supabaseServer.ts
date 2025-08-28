// lib/supabaseServer.ts
import { createClient as createServerClient } from '@supabase/supabase-js';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // IMPORTANT: Service Role key on the server to bypass RLS in API routes
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createServerClient(url, serviceRoleKey, { auth: { persistSession: false } });
}
