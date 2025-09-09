// lib/role.ts

export type AppRole = 'super-admin' | 'country-admin' | 'public';

export function roleLabel(role: AppRole) {
  switch (role) {
    case 'super-admin':   return 'Super Admin';
    case 'country-admin': return 'Country Admin';
    default:              return 'Public';
  }
}
