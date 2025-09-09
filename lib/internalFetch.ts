// lib/internalFetch.ts
import { cookies, headers } from 'next/headers'

/**
 * Compute an absolute base URL the server can use to call itself.
 * - On Vercel: https://<vercel-url>
 * - Else: http://localhost:3000 (fallback)
 */
function internalBaseUrl(): string {
  // Prefer explicit env if present
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL

  // Vercel provides VERCEL_URL (no protocol)
  const vercel = process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`

  // Fallback to localhost in dev/unknown
  return 'http://localhost:3000'
}

/**
 * Server-only helper to GET your own Next routes and return JSON typed as T.
 * It forwards the caller's cookies to preserve session/role.
 */
export async function internalGet<T>(path: string): Promise<T> {
  // forward cookies and host header (Next 15: these are async in RSC/route handlers)
  const cookieHeader = (await cookies()).toString()
  const h = await headers()
  const host = h.get('host') ?? ''
  const url = new URL(path, internalBaseUrl()).toString()

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      cookie: cookieHeader,
      host, // helpful for some middlewares
      accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    // surface a meaningful error to the caller
    const text = await res.text().catch(() => '')
    throw new Error(`GET ${path} failed: ${res.status}${text ? ` — ${text}` : ''}`)
  }

  return res.json() as Promise<T>
}
