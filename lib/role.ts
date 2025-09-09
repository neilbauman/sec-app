// lib/role.ts
import { cookies } from 'next/headers';

export type AppRole = 'super-admin' | 'country-admin' | 'public';

const isValidRole = (x: unknown): x is AppRole =>
  x === 'super-admin' || x === 'country-admin' || x === 'public';

export function roleLabel(role: AppRole) {
  if (role === 'super-admin') return 'Super Admin';
  if (role === 'country-admin') return 'Country Admin';
  return 'Public';
}

/**
 * Next.js 15: cookies() is async. Always `await cookies()` before get().
 * Fallback order: cookie → env (NEXT_PUBLIC_DEMO_ROLE) → 'public'
 */
export async function getCurrentRole(): Promise<AppRole> {
  try {
    const c = (await cookies()).get('role')?.value as AppRole | undefined;
    if (isValidRole(c)) return c;
  } catch {
    // no-op: cookies() can throw in some non-request contexts
  }

  const env = (process.env.NEXT_PUBLIC_DEMO_ROLE || '').toLowerCase() as AppRole;
  if (isValidRole(env)) return env;

  return 'public';
}
