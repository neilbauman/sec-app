// lib/internalFetch.ts
export async function internalGet(path: string, init?: RequestInit) {
  return fetch(path, { cache: 'no-store', ...init })
}
export async function internalPost(path: string, body: unknown, init?: RequestInit) {
  return fetch(path, {
    method: 'POST',
    cache: 'no-store',
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
    body: JSON.stringify(body),
    ...init,
  })
}
