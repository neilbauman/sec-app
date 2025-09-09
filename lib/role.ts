// lib/role.ts
import { cookies, headers } from 'next/headers';

export type AppRole = 'super-admin' | 'country-admin' | 'public';

export async function getCurrentRole(): Promise<AppRole> {
  // 1) Temporary dev bypass: header or cookie (easy to flip off later)
  const h = headers();
  const bypass = h.get('x-dev-role') || cookies().get('role')?.value;

  if (bypass === 'super-admin' || bypass === 'country-admin' || bypass === 'public') {
    return bypass as AppRole;
  }

  // 2) Your “real” logic (keep this intact for later)
  // e.g. verify JWT/session/user… for now just fall back:
  const env = (process.env.NEXT_PUBLIC_DEMO_ROLE || '').toLowerCase();
  if (env === 'super-admin' || env === 'country-admin' || env === 'public') return env as AppRole;

  return 'public';
}
