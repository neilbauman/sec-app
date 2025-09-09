import { cookies } from 'next/headers'

export type AppRole = 'public' | 'country-admin' | 'super-admin'

export async function getCurrentRole(): Promise<AppRole> {
  // Priority: cookie -> env -> 'public'
  try {
    const jar = await cookies()
    const c = jar.get('role')?.value as AppRole | undefined
    if (c === 'super-admin' || c === 'country-admin' || c === 'public') return c
  } catch {}
  const env = process.env.NEXT_PUBLIC_DEFAULT_ROLE as AppRole | undefined
  if (env === 'super-admin' || env === 'country-admin' || env === 'public') return env
  return 'public'
}

export function roleLabel(role: AppRole): string {
  if (role === 'super-admin') return 'Super Admin'
  if (role === 'country-admin') return 'Country Admin'
  return 'Public'
}
