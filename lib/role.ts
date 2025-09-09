// lib/role.ts
// Centralized role utilities for the app.
//
// Exports:
// - AppRole (type)
// - getCurrentRole()  -> async, reads cookie/env and returns a role
// - roleLabel()       -> pretty label for UI

import { cookies } from 'next/headers'

export type AppRole = 'super-admin' | 'country-admin' | 'public'

/**
 * Returns the current role.
 * Priority: cookie → env (NEXT_PUBLIC_DEMO_ROLE) → 'public'
 */
export async function getCurrentRole(): Promise<AppRole> {
  // 1) Try cookie (works in RSC, route handlers, server components)
  try {
    const store = await cookies() // Note: Next 15 returns a Promise
    const raw = store.get('role')?.value?.toLowerCase()
    if (raw === 'super-admin' || raw === 'country-admin' || raw === 'public') {
      return raw
    }
  } catch {
    // non-request contexts can throw; ignore and fall back
  }

  // 2) Fallback to env for quick demo switching
  const env = (process.env.NEXT_PUBLIC_DEMO_ROLE || '').toLowerCase()
  if (env === 'super-admin' || env === 'country-admin' || env === 'public') {
    return env
  }

  // 3) Default
  return 'public'
}

export function roleLabel(role: AppRole): string {
  switch (role) {
    case 'super-admin':
      return 'Super Admin'
    case 'country-admin':
      return 'Country Admin'
    default:
      return 'Public'
  }
}
