// app/comprehensive/internal/page.tsx
export const dynamic = 'force-dynamic'

async function loadData() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000'
  const url =
    typeof base === 'string' && base.startsWith('http')
      ? `${base}/comprehensive/internal/list`
      : `https://${base}/comprehensive/internal/list`

  const res = await fetch(url, {
    headers: { 'x-internal-token': process.env.INTERNAL_API_TOKEN || '' },
    cache: 'no-store',
  })
  if (!res.ok) return { ok: false, status: res.status, text: await res.text() }
  return res.json()
}

export default async function InternalOverviewPage() {
  const data = await loadData()
  if (!data?.ok) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Comprehensive Framework – Internal</h1>
        <p className="mt-3">Could not load internal data. HTTP {data?.status}</p>
      </main>
    )
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Comprehensive Framework – Internal</h1>
      <pre className="p-3 bg-gray-100 rounded text-sm overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
      <p className="mt-3 text-sm text-gray-500">
        This is an internal view using a token header. We’ll replace this with the rich editor later.
      </p>
    </main>
  )
}
