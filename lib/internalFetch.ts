// lib/internalFetch.ts
import { cookies, headers } from 'next/headers';

/**
 * Same-origin fetch that forwards the request cookies to Route Handlers.
 * Use absolute URL so Node fetch will send the Cookie header we attach.
 */
function internalBaseUrl() {
  // Vercel provides VERCEL_URL at runtime (no protocol)
  const vercel = process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`;
  // Fallback for local dev
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

export async function internalGet<T>(path: string): Promise<T> {
  const cookieHeader = cookies().toString(); // forward the caller's cookies
  const host = headers().get('host') ?? '';
  const url = new URL(path, internalBaseUrl()).toString();

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      cookie: cookieHeader,
      // helps some setups behind proxies
      'x-forwarded-host': host,
    },
    cache: 'no-store',
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`GET ${path} failed: ${res.status}${body ? ` – ${body}` : ''}`);
  }
  return res.json() as Promise<T>;
}
