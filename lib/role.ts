// lib/role.ts
import { cookies } from 'next/headers'

export type AppRole = 'super-admin' | 'country-admin' | 'public'

export function roleLabel(r: AppRole) {
  return r === 'super-admin' ? 'Super Admin'
    : r === 'country-admin' ? 'Country Admin'
    : 'Public'
}

// Safe in both RSC and route handlers (cookies() is sync in Next 15)
export function getCurrentRole(): AppRole {
  // Priority: cookie → env (for quick demos) → 'public'
  try {
    const c = cookies().get('role')?.value as AppRole | undefined
    if (c === 'super-admin' || c === 'country-admin' || c === 'public') return c
  } catch {
    // non-request contexts: ignore
  }
  const env = (process.env.NEXT_PUBLIC_DEMO_ROLE || '').toLowerCase()
  if (env === 'super-admin' || env === 'country-admin' || env === 'public') return env
  return 'public'
}
