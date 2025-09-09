// lib/role.ts
import { cookies } from 'next/headers'

export type AppRole = 'super-admin' | 'country-admin' | 'public'

export function roleLabel(role: AppRole) {
  switch (role) {
    case 'super-admin':
      return 'Super Admin'
    case 'country-admin':
      return 'Country Admin'
    default:
      return 'Public'
  }
}

/**
 * Synchronous on the server (Next.js app router). If called in a non-request context,
 * we fall back to PUBLIC unless an override exists.
 */
export function getCurrentRole(): AppRole {
  try {
    // cookies() is synchronous in route handlers & server components
    const c = cookies().get('role')?.value as AppRole | undefined
    if (c === 'super-admin' || c === 'country-admin' || c === 'public') return c
  } catch {
    // non-request contexts – ignore
  }
  // Optional override for CI/testing:
  const env = (process.env.DEFAULT_ROLE || '').toLowerCase()
  if (env === 'super-admin' || env === 'country-admin' || env === 'public') return env
  return 'public'
}
