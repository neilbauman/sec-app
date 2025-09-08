// app/comprehensive/page.tsx
import React from 'react'

// avoid static HTML export + revalidate mistakes
export const dynamic = 'force-dynamic'

async function loadData() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000'
  const url =
    typeof base === 'string' && base.startsWith('http')
      ? `${base}/comprehensive/internal/list`
      : `https://${base}/comprehensive/internal/list`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'x-internal-token': process.env.INTERNAL_API_TOKEN || '',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    return { ok: false, status: res.status, text: await res.text() }
  }
  return res.json()
}

export default async function ComprehensiveReadOnlyPage() {
  const data = await loadData()

  if (!data?.ok) {
    return (
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-4">Comprehensive Framework (read-only)</h1>
        <p>Failed to load comprehensive framework data.</p>
        {data?.status && <p className="mt-2">HTTP {data.status}</p>}
        <p className="mt-4 text-sm text-gray-500">
          You can also inspect the raw endpoint at <code>/comprehensive/internal/list</code>.
        </p>
      </main>
    )
  }

  const c = data.counts || {}

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Comprehensive Framework (read-only)</h1>

      <ul className="list-disc pl-6 space-y-1">
        <li>Pillars: {c.pillars ?? 0}</li>
        <li>Themes: {c.themes ?? 0}</li>
        <li>Sub-themes: {c.subthemes ?? 0}</li>
        <li>Indicators: {c.indicators ?? 0}</li>
        <li>Levels: {c.levels ?? 0}</li>
        <li>Criteria: {c.criteria ?? 0}</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8">Sample rows</h2>
      <pre className="mt-3 p-3 rounded bg-gray-100 overflow-auto text-sm">
        {JSON.stringify(
          {
            indicator: data.samples?.indicator?.[0] ?? null,
            level: data.samples?.level?.[0] ?? null,
            criterion: data.samples?.criterion?.[0] ?? null,
          },
          null,
          2
        )}
      </pre>

      <p className="mt-4 text-sm text-gray-500">
        Data is fetched server-side from <code>/comprehensive/internal/list</code> using a secret header.
      </p>
    </main>
  )
}
