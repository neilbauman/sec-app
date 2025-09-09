export async function internalGet<T = any>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}${path}` || path
  const res = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    ...init,
  })
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}
