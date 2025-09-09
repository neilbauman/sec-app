// lib/internalFetch.ts
export async function internalGet(path: string, init?: RequestInit): Promise<Response> {
  // relative to this Next app
  const url = path.startsWith('/') ? path : `/${path}`
  // force dynamic (no cache) for admin screens; adjust if you later add caching
  return fetch(url, { ...init, cache: 'no-store' })
}
