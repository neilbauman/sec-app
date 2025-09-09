// lib/internalFetch.ts
import 'server-only';
import { cookies } from 'next/headers';

function internalBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

/**
 * GET a JSON payload from an internal API route.
 * Returns the parsed body (typed), not a Response, to avoid Response/Promise type confusion.
 */
export async function internalGet<T>(path: string): Promise<T> {
  const cookieHeader = (await cookies()).toString();
  const url = new URL(path, internalBaseUrl()).toString();

  const res = await fetch(url, {
    method: 'GET',
    headers: { cookie: cookieHeader },
    cache: 'no-store',
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(`GET ${path} failed: ${res.status}${msg ? ` – ${msg}` : ''}`);
  }
  return (await res.json()) as T;
}

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}
