// lib/role.ts
import { cookies } from 'next/headers'

export type AppRole = 'super-admin' | 'country-admin' | 'public'

export async function getCurrentRole(): Promise<AppRole> {
  // Priority: cookie → env (for demos) → 'public'
  try {
    const c = cookies().get('role')?.value as AppRole | undefined
    if (c === 'super-admin' || c === 'country-admin' || c === 'public') return c
  } catch {
    // no-op (cookies() may not be available in some contexts)
  }
  const env = (process.env.NEXT_PUBLIC_DEMO_ROLE || '').toLowerCase()
  if (env === 'super-admin' || env === 'country-admin' || env === 'public') return env as AppRole
  return 'public'
}

export function roleLabel(role: AppRole) {
  if (role === 'super-admin') return 'Super Admin'
  if (role === 'country-admin') return 'Country Admin'
  return 'Public'
}
