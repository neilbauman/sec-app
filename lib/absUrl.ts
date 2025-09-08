// lib/absUrl.ts
import 'server-only'

/**
 * Returns an absolute URL for server-side fetches.
 * Priority:
 * 1) NEXT_PUBLIC_SITE_URL (set this to your canonical domain if you like)
 * 2) VERCEL_URL (auto-set on Vercel: e.g., my-app-abc123.vercel.app)
 * 3) http://localhost:3000 (fallback for local dev)
 */
export function absUrl(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  return `${base}${p}`
}
