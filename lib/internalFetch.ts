// lib/internalFetch.ts
import { headers } from 'next/headers';

/**
 * Build an absolute URL for internal routes, both on server and Vercel.
 */
function absUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const h = headers();
  // In build/type-check contexts headers() may not be available; guard carefully
  let proto = 'http';
  let host = 'localhost:3000';
  try {
    const hh = (h as any);
    proto = hh?.get?.('x-forwarded-proto') ?? proto;
    host  = hh?.get?.('x-forwarded-host')  ?? hh?.get?.('host') ?? host;
  } catch {}
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${proto}://${host}${p}`;
}

/**
 * A single helper that:
 *  - calls an internal endpoint
 *  - throws on non-2xx
 *  - returns parsed JSON as type T
 */
export async function internalGet<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const url = absUrl(path);
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Forward our internal token if present (keeps your /framework/api/list happy)
      'x-internal-token': process.env.INTERNAL_TOKEN ?? '',
    },
    cache: 'no-store',
    ...init,
  });

  if (!res.ok) {
    // Try to surface JSON error body if available
    let detail: any = null;
    try { detail = await res.json(); } catch {}
    const msg = detail?.message || `Request failed: ${res.status}`;
    const err = new Error(msg) as Error & { status?: number; body?: any };
    err.status = res.status;
    err.body = detail;
    throw err;
  }

  // typed JSON
  return (await res.json()) as T;
}
