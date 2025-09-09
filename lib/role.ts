// lib/role.ts
import { cookies } from 'next/headers'

export type AppRole = 'super-admin' | 'country-admin' | 'public'

export function roleLabel(role: AppRole): string {
  if (role === 'super-admin') return 'Super Admin'
  if (role === 'country-admin') return 'Country Admin'
  return 'Public'
}

/**
 * Read the current role from the cookie (async on Next 15).
 * Falls back to env (for quick demos) then to 'public'.
 */
export async function getCurrentRole(): Promise<AppRole> {
  try {
    const c = (await cookies()).get('role')?.value as AppRole | undefined
    if (c === 'super-admin' || c === 'country-admin' || c === 'public') return c
  } catch {
    // non-request contexts: ignore and fall through
  }
  const envRole = process.env.DEMO_ROLE as AppRole | undefined
  if (envRole === 'super-admin' || envRole === 'country-admin' || envRole === 'public') {
    return envRole
  }
  return 'public'
}
