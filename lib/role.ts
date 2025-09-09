// lib/role.ts
import { cookies } from 'next/headers'

export type AppRole = 'public' | 'country-admin' | 'super-admin'

export function getCurrentRole(): AppRole {
  try {
    const c = cookies().get('role')?.value as AppRole | undefined
    if (c === 'super-admin' || c === 'country-admin' || c === 'public') return c
  } catch {
    // no-op: not in a request context
  }
  const envRole = process.env.DEFAULT_ROLE as AppRole | undefined
  if (envRole === 'super-admin' || envRole === 'country-admin' || envRole === 'public') return envRole
  return 'public'
}

export function roleLabel(role: AppRole) {
  if (role === 'super-admin') return 'Super Admin'
  if (role === 'country-admin') return 'Country Admin'
  return 'Public'
}
