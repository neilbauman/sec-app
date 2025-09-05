// app/lib/supabaseClient.ts
// Minimal, Vercel-friendly Supabase client helpers for Next.js App Router.

import { createClient as createSupabaseBrowserClient } from '@supabase/supabase-js'

// If you later need server-side cookie handling, you can swap this for
// @supabase/ssr's createServerClient. For now we keep it simple and
// avoid cookie APIs that can vary by Next.js version.

type SupabaseClient = ReturnType<typeof createSupabaseBrowserClient>

// --- Environment guards -------------------------------------------------
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Fail fast with a clear message in build logs
  // (Vercel shows console output during build).
  // The app can still start, but any call will throw early.
  // eslint-disable-next-line no-console
  console.warn(
    '[supabaseClient] Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  )
}

// --- Browser/client instance --------------------------------------------
let browserClient: SupabaseClient | null = null

/**
 * createClient()
 * Returns a singleton browser Supabase client.
 * Safe to call in React components and client-side code.
 */
export function createClient(): SupabaseClient {
  if (browserClient) return browserClient
  browserClient = createSupabaseBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
  return browserClient
}

// --- Optional: server helper (kept minimal) -----------------------------
/**
 * createServerClient()
 * Very thin wrapper that returns a new client. If you later need to
 * attach cookies for RLS/session, switch this to `@supabase/ssr` and
 * wire up Next.js cookies. For now this avoids build differences.
 */
export function createServerClient(): SupabaseClient {
  return createSupabaseBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

// Backwards-compat alias some pages might import:
export const getSupabase = createClient
