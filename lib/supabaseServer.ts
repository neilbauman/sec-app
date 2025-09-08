// lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js'

export function getServerClient() {
  const url = process.env.SUPABASE_URL!
  // IMPORTANT: service role key
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  })
}
