// lib/internalFetch.ts
import { headers } from 'next/headers'

/**
 * Same-origin fetch helper for server code.
 * - Forwards the inbound request cookies so auth/role checks work on API routes.
 * - Always no-store to avoid showing stale framework data while editing.
 */
export async function internalGet(path: string, init?: RequestInit) {
  const h = new Headers(init?.headers)
  const cookie = headers().get('cookie')
  if (cookie) h.set('cookie', cookie)

  const res = await fetch(path, {
    ...init,
    headers: h,
    cache: 'no-store',
    // Next.js 15: ensure we’re not prefetching across requests
    credentials: 'include',
  })
  return res
}
