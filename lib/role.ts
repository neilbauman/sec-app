// lib/role.ts
export type AppRole = 'super-admin' | 'country-admin' | 'public';

export function roleLabel(role: AppRole): string {
  switch (role) {
    case 'super-admin':   return 'Super Admin';
    case 'country-admin': return 'Country Admin';
    default:              return 'Public';
  }
}

// If this was async before, keep it async; if it reads cookies() in server components, keep it server-safe.
export async function getCurrentRole(): Promise<AppRole> {
  // your existing cookie/env logic
  // ...
  return 'public';
}
