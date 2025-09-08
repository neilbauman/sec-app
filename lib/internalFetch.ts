// lib/internalFetch.ts
import { getBaseUrl } from './absUrl';

/**
 * Server-only helper to call our internal API routes with the shared secret.
 * IMPORTANT: only import/call this from Server Components or server actions.
 */
export async function internalGet(path: string, init?: RequestInit) {
  const base = await getBaseUrl();
  const url = `${base}${path}`;

  const res = await fetch(url, {
    ...init,
    // Ensure we never cache these while we’re iterating
    cache: 'no-store',
    // Always send the shared secret for internal routes
    headers: {
      ...(init?.headers || {}),
      'x-internal-token': process.env.INTERNAL_API_TOKEN ?? '',
    },
  });

  return res;
}
