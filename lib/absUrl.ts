// lib/absUrl.ts
import 'server-only'
import { headers } from 'next/headers'

export function absUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const h = headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const p = path.startsWith('/') ? path : `/${path}`
  return `${proto}://${host}${p}`
}
