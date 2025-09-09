// lib/internalFetch.ts
import { absUrl } from './absUrl'

/**
 * Fetch JSON from a local API route using an absolute URL that works on Vercel.
 * Throws if HTTP status is not OK. Returns typed JSON.
 */
export async function internalGetJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const url = absUrl(path)
  const res = await fetch(url, { ...init, cache: 'no-store' })
  if (!res.ok) {
    const body = await safeJson(res)
    throw new Error(`Fetch failed ${res.status} ${res.statusText}. Body: ${JSON.stringify(body)}`)
  }
  return (await res.json()) as T
}

/**
 * Optional: raw Response helper, if you ever need it.
 * (Use this if you truly want to check res.ok yourself.)
 */
export async function internalGetResponse(path: string, init?: RequestInit): Promise<Response> {
  const url = absUrl(path)
  return fetch(url, { ...init, cache: 'no-store' })
}

async function safeJson(res: Response) {
  try { return await res.json() } catch { return null }
}
