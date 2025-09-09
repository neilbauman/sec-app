// lib/role.ts
import { cookies } from 'next/headers';

export type AppRole = 'super-admin' | 'country-admin' | 'public';

export function roleLabel(role: AppRole) {
  if (role === 'super-admin') return 'Super Admin';
  if (role === 'country-admin') return 'Country Admin';
  return 'Public';
}

/**
 * Next 15: cookies() is async. Read role from cookie, then env fallback, then 'public'.
 */
export async function getCurrentRole(): Promise<AppRole> {
  try {
    const store = await cookies();
    const c = store.get('role')?.value as AppRole | undefined;
    if (c === 'super-admin' || c === 'country-admin' || c === 'public') return c;
  } catch {
    // ignore – non-request context
  }

  const fromEnv = process.env.DEFAULT_ROLE as AppRole | undefined;
  if (fromEnv === 'super-admin' || fromEnv === 'country-admin' || fromEnv === 'public') {
    return fromEnv;
  }
  return 'public';
}
