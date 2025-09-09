// lib/internalFetch.ts
// Small helper for server-side fetch to your own routes with absolute URL handling

import { headers } from 'next/headers'

function absUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const h = headers()
  const proto = (h.get('x-forwarded-proto') ?? 'http')
  const host = (h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${proto}://${host}${p}`
}

export async function internalGet(input: string, init?: RequestInit) {
  const url = absUrl(input)
  // Type-safe Response
  const res = await fetch(url, { ...init, cache: 'no-store' })
  return res
}

export async function internalPostJSON<TBody extends object>(
  input: string,
  body: TBody,
  init?: RequestInit
) {
  const url = absUrl(input)
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
    body: JSON.stringify(body),
    cache: 'no-store',
    ...init,
  })
  return res
}
