// lib/role.ts
import { cookies } from 'next/headers';

export type AppRole = 'super-admin' | 'country-admin' | 'public';

// Small label helper used on the dashboard
export function roleLabel(role: AppRole) {
  switch (role) {
    case 'super-admin':
      return 'Super Admin';
    case 'country-admin':
      return 'Country Admin';
    default:
      return 'Public';
  }
}

// Used by route handlers and server components
export function getCurrentRole(): AppRole {
  // Priority: cookie → env (for demos) → 'public'
  try {
    const c = cookies().get('role')?.value as AppRole | undefined;
    if (c === 'super-admin' || c === 'country-admin' || c === 'public') return c;
  } catch {
    // no-op: cookies() not available in some non-request contexts
  }
  const env = (process.env.NEXT_PUBLIC_DEMO_ROLE || '').toLowerCase();
  if (env === 'super-admin' || env === 'country-admin' || env === 'public') return env as AppRole;
  return 'public';
}

// Simple permission helpers (use wherever useful)
export const isSuperAdmin = (r: AppRole) => r === 'super-admin';
export const canEditPrimaryFramework = (r: AppRole) => r === 'super-admin';
