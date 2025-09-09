// lib/role.ts
import { cookies } from 'next/headers'

export type AppRole = 'super-admin' | 'country-admin' | 'public'

export function roleLabel(role: AppRole) {
  if (role === 'super-admin') return 'Super Admin'
  if (role === 'country-admin') return 'Country Admin'
  return 'Public'
}

/**
 * Next 15: cookies() is async. This returns the current role (default 'public').
 */
export async function getCurrentRole(): Promise<AppRole> {
  try {
    const cookieStore = await cookies()
    const role = cookieStore.get('role')?.value as AppRole | undefined
    if (role === 'super-admin' || role === 'country-admin' || role === 'public') {
      return role
    }
  } catch {
    // non-request contexts or no cookies available
  }
  // Fallback for demos
  if (process.env.DEFAULT_ROLE === 'super-admin' || process.env.DEFAULT_ROLE === 'country-admin') {
    return process.env.DEFAULT_ROLE as AppRole
  }
  return 'public'
}
