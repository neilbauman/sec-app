// lib/internalFetch.ts
import { absUrl } from '@/lib/absUrl'

/**
 * Fetch JSON from an internal API route as a typed value.
 * Throws on non-2xx.
 */
export async function internalGet<T = unknown>(path: string): Promise<T> {
  const url = absUrl(path)
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`${res.status}`)
  }
  return res.json() as Promise<T>
}
