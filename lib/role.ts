// lib/role.ts
import 'server-only'
import { cookies } from 'next/headers'

export type AppRole = 'public' | 'country-admin' | 'super-admin'

export function getCurrentRole(): AppRole {
  // Priority: cookie → env (for quick demos) → 'public'
  const c = cookies().get('role')?.value as AppRole | undefined
  if (c === 'super-admin' || c === 'country-admin' || c === 'public') return c
  const env = (process.env.NEXT_PUBLIC_DEMO_ROLE || '').toLowerCase()
  if (env === 'super-admin' || env === 'country-admin' || env === 'public') return env
  return 'public'
}

export function roleLabel(role: AppRole) {
  if (role === 'super-admin') return 'Super Admin'
  if (role === 'country-admin') return 'Country Admin'
  return 'Public'
}
