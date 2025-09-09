// lib/role.ts
import { cookies } from 'next/headers'

export type AppRole = 'public' | 'country-admin' | 'super-admin'

export function roleLabel(role: AppRole) {
  if (role === 'super-admin') return 'Super Admin'
  if (role === 'country-admin') return 'Country Admin'
  return 'Public'
}

/**
 * Server-only helper. Reads the 'role' cookie.
 * Falls back to process.env.DEMO_ROLE (for demos) or 'public'.
 */
export function getCurrentRole(): AppRole {
  try {
    const c = cookies().get('role')?.value as AppRole | undefined
    if (c === 'super-admin' || c === 'country-admin' || c === 'public') return c
  } catch { /* non-request contexts */ }

  const env = (process.env.DEMO_ROLE || 'public').toLowerCase()
  if (env === 'super-admin' || env === 'country-admin' || env === 'public') return env
  return 'public'
}
