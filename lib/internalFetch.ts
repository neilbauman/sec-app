// lib/internalFetch.ts
import { cookies, headers } from 'next/headers'

function internalBaseUrl() {
  // Vercel/Next internal URL builder: always absolute to avoid relative fetch oddities
  // Prefer NEXT_PUBLIC_SITE_URL for local/dev; else construct from host header.
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (envUrl) return envUrl
  return 'http://localhost:3000'
}

/**
 * Server-side helper that forwards caller cookies to our own API routes and returns parsed JSON.
 * Next 15: cookies() and headers() are async.
 */
export async function internalGet<T>(path: string): Promise<T> {
  const cookieHeader = (await cookies()).toString()
  const hdrs = await headers()
  const host = hdrs.get('host') ?? ''
  const url = new URL(path, internalBaseUrl()).toString()

  const res = await fetch(url, {
    method: 'GET',
    // Do not cache editor/API reads
    cache: 'no-store',
    headers: {
      Cookie: cookieHeader,
      // Useful when your route logic needs to know the original host
      'x-forwarded-host': host,
    },
  })

  if (!res.ok) {
    const body = await safeText(res)
    throw new Error(`GET ${path} failed: ${res.status}${body ? ` – ${body}` : ''}`)
  }
  return (await res.json()) as T
}

export async function internalPost<T>(path: string, body?: unknown): Promise<T> {
  const cookieHeader = (await cookies()).toString()
  const url = new URL(path, internalBaseUrl()).toString()

  const res = await fetch(url, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      Cookie: cookieHeader,
      'content-type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await safeText(res)
    throw new Error(`POST ${path} failed: ${res.status}${text ? ` – ${text}` : ''}`)
  }
  return (await res.json()) as T
}

async function safeText(res: Response) {
  try { return await res.text() } catch { return '' }
}
