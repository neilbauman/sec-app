// lib/absUrl.ts
import { headers } from 'next/headers';

/**
 * Returns an absolute base URL for the current request. Works on Vercel + local dev.
 * We keep it tolerant: prefers incoming headers, then Vercel env, then localhost.
 */
export async function getBaseUrl(): Promise<string> {
  const h = await headers(); // Next 15: async
  const xfwdProto = h.get('x-forwarded-proto');
  const xfwdHost = h.get('x-forwarded-host');
  const host = h.get('host');

  // Prefer forwarded headers (Vercel/edge)
  if (xfwdProto && xfwdHost) return `${xfwdProto}://${xfwdHost}`;

  // Fallback to Host
  if (host) return `https://${host}`;

  // Environment fallbacks (Vercel)
  const envUrl =
    process.env.VERCEL_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) {
    const clean = envUrl.replace(/^https?:\/\//, '');
    return `https://${clean}`;
  }

  // Local dev fallback
  return 'http://localhost:3000';
}
