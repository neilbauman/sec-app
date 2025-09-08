// app/comprehensive/page.tsx
import { headers } from 'next/headers'

async function loadData() {
  // Build absolute URL to our internal route
  const h = headers()
  const host =
    h.get('x-forwarded-host') ??
    h.get('host') ??
    process.env.VERCEL_URL ??
    'localhost:3000'
  const proto = (h.get('x-forwarded-proto') ?? (host.includes('localhost') ? 'http' : 'https'))
  const base = `${proto}://${host}`

  const res = await fetch(`${base}/comprehensive/api/list`, {
    method: 'GET',
    // Include our internal token header so the route authorizes us.
    headers: {
      'x-internal-token': process.env.INTERNAL_API_TOKEN ?? '',
    },
    // Avoid caching while we iterate
    cache: 'no-store',
  })

  if (!res.ok) {
    return { ok: false, status: res.status, message: 'Failed to fetch' as const }
  }
  return (await res.json()) as any
}

export const dynamic = 'force-dynamic'

export default async function ComprehensiveReadOnly() {
  const data = await loadData()

  if (!data?.ok) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Comprehensive Framework (read-only)</h1>
        <p className="text-red-600">Failed to load comprehensive framework data.</p>
        {data?.status ? <p className="mt-2">HTTP {data.status}</p> : null}
        <p className="mt-2">
          You can also inspect the raw endpoint at <code>/comprehensive/api/list</code>.
        </p>
      </div>
    )
  }

  const c = data.counts ?? {}
  const sample = data.sample ?? []

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Comprehensive Framework (read-only)</h1>

      <ul className="list-disc pl-6 space-y-1">
        <li>Pillars: {c.pillars ?? 0}</li>
        <li>Themes: {c.themes ?? 0}</li>
        <li>Sub–themes: {c.subthemes ?? 0}</li>
        <li>Indicators: {c.indicators ?? 0}</li>
        <li>Levels: {c.levels ?? 0}</li>
        <li>Criteria: {c.criteria ?? 0}</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">Sample rows</h2>
      <pre className="bg-gray-100 rounded p-4 text-sm overflow-auto">
        {JSON.stringify(sample[0] ?? { pillar: null, theme: null, subtheme: null, indicator: null, level: null, criterion: null }, null, 2)}
      </pre>

      <p className="text-sm text-gray-600 mt-4">
        Data is fetched from <code>/comprehensive/api/list</code>. Once these counts/samples look
        correct, we’ll layer in the rich UI.
      </p>
    </div>
  )
}
