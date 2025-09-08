// app/framework/page.tsx
import { headers } from 'next/headers'
import { absUrl } from '@/lib/absUrl';

export const dynamic = 'force-dynamic'

type FrameworkList = {
  ok: boolean
  counts?: { pillars: number; themes: number; subthemes: number }
}

async function fetchList(): Promise<FrameworkList> {
  // We add the secret header from the server (safe to read env here)
  const token = process.env.INTERNAL_API_TOKEN!
  const h = new Headers()
  h.set('x-internal-api-token', token)

  // Absolute URL is safest on Vercel
  const host =
    headers().get('x-forwarded-host') ??
    headers().get('host') ??
    process.env.VERCEL_URL ??
    'localhost:3000'

  const url = absUrl('/framework/api/list');
  const res = await fetch(url, {
    method: 'GET',
    headers: h,
    // opt out of ISR while we’re iterating
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    return { ok: false }
  }
  return res.json()
}

export default async function FrameworkPage() {
  const data = await fetchList()

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Primary Framework Editor</h1>
      {!data.ok ? (
        <p className="mt-4 text-red-600">Failed to load primary framework data.</p>
      ) : (
        <div className="mt-4 space-y-1">
          <div>Pillars: {data.counts?.pillars ?? 0}</div>
          <div>Themes: {data.counts?.themes ?? 0}</div>
          <div>Sub-themes: {data.counts?.subthemes ?? 0}</div>
        </div>
      )}
      <p className="mt-8 text-sm text-gray-500">
        Data is fetched from <code>/framework/api/list</code> using a server-injected secret header.
      </p>
    </div>
  )
}
