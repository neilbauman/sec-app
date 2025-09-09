// lib/internalFetch.ts

/**
 * Internal fetch helper for server components.
 * Calls API routes relative to this Next.js app.
 * Keeps things simple for now — no forwarding headers/cookies until needed.
 */

export async function internalGet<T>(path: string): Promise<T> {
  const url = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store", // always fresh data
  });

  if (!res.ok) {
    throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

export async function internalPost<T>(
  path: string,
  body: any
): Promise<T> {
  const url = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`POST ${url} failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}
