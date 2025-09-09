// lib/role.ts
// Next 15: cookies() is async — always await it.

import { cookies } from 'next/headers'

export type AppRole = 'super-admin' | 'country-admin' | 'public'

export function roleLabel(r: AppRole) {
  if (r === 'super-admin') return 'Super Admin'
  if (r === 'country-admin') return 'Country Admin'
  return 'Public'
}

/**
 * Read the current role from a cookie, then from env, finally 'public'.
 * NOTE: This is async in Next 15 because cookies() is async.
 */
export async function getCurrentRole(): Promise<AppRole> {
  // 1) cookie (preferred during dev)
  try {
    const jar = await cookies()
    const c = jar.get('role')?.value as AppRole | undefined
    if (c === 'super-admin' || c === 'country-admin' || c === 'public') return c
  } catch {
    // no-op for non-request contexts
  }

  // 2) env (fallback for demos)
  const env = (process.env.NEXT_PUBLIC_DEMO_ROLE || '').toLowerCase() as AppRole | ''
  if (env === 'super-admin' || env === 'country-admin' || env === 'public') return env

  // 3) default
  return 'public'
}

/**
 * Helper for route handlers that must be super-admin.
 * Returns null if allowed, or a JSON Response you should return immediately.
 */
export async function requireSuperAdmin() {
  const r = await getCurrentRole()
  if (r !== 'super-admin') {
    return Response.json({ ok: false, message: 'Forbidden' }, { status: 403 })
  }
  return null
}
