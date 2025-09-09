// lib/role.ts
import { cookies } from 'next/headers'

export type AppRole = 'public' | 'country-admin' | 'super-admin'

export function roleLabel(role: AppRole) {
  if (role === 'super-admin') return 'Super Admin'
  if (role === 'country-admin') return 'Country Admin'
  return 'Public'
}

/**
 * Get role for the current request (server-only).
 * Priority: cookie → env (for demos) → 'public'
 */
export function getCurrentRole(): AppRole {
  try {
    const c = cookies().get('role')?.value as AppRole | undefined
    if (c === 'super-admin' || c === 'country-admin' || c === 'public') return c
  } catch {
    // no-op: cookies() not available outside request – we fall back below
  }
  const env = (process.env.DEMO_ROLE as AppRole | undefined) ?? 'public'
  return env
}
