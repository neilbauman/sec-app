// lib/supabaseClient.ts
import { createClient as createBrowserClient } from '@supabase/supabase-js'

/**
 * Single place to create a typed browser Supabase client.
 * We intentionally export a *named* function `createClient` so
 * pages can `import { createClient } from '@/lib/supabaseClient'`.
 *
 * You must have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * available at build/runtime (already in your .env.local on Vercel).
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    // Fail loudly in build logs if env not present
    throw new Error(
      'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }

  return createBrowserClient(url, anon)
}

// Optional: keep a singleton for convenience if you prefer
let _client: ReturnType<typeof createBrowserClient> | null = null
export function supabase() {
  if (_client) return _client
  _client = createClient()
  return _client
}
