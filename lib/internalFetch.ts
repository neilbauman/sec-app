// lib/internalFetch.ts
import 'server-only'
import { absUrl } from './absUrl'

export async function internalGet<T = unknown>(path: string): Promise<T> {
  const url = absUrl(path)
  const res = await fetch(url, {
    headers: {
      'x-internal-token': process.env.INTERNAL_API_TOKEN ?? '',
    },
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Internal GET ${url} failed: ${res.status} ${text}`)
  }
  return res.json() as Promise<T>
}
