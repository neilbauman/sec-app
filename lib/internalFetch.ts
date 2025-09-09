// lib/internalFetch.ts
import { headers, cookies } from "next/headers";

// Build an absolute base URL so server-to-server fetches always resolve correctly
function internalBaseUrl(hostFromHeader?: string) {
  // Vercel provides VERCEL_URL in serverless runtime
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (hostFromHeader) return `https://${hostFromHeader}`;
  // fallback for local dev
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
}

export async function internalGet<T>(path: string): Promise<T> {
  // Next 15: headers()/cookies() are async
  const h = await headers();
  const cookieStore = await cookies();

  const host = h.get("host") ?? "";
  const url = new URL(path, internalBaseUrl(host)).toString();

  // Forward caller cookies so RLS/session (if you add auth later) can flow through
  const cookieHeader = cookieStore.toString();

  const res = await fetch(url, {
    method: "GET",
    headers: {
      // forward cookies; leave other headers minimal
      Cookie: cookieHeader,
    },
    // Route handlers are same-origin; no need for next: { revalidate } here
    cache: "no-store",
  });

  if (!res.ok) {
    // Throwing keeps your calling page's try/catch/simple error UI working
    throw new Error(`GET ${path} failed: ${res.status}`);
  }

  return (await res.json()) as T;
}
