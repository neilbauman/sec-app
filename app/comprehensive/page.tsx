// app/comprehensive/page.tsx
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

type CompData = {
  ok: boolean
  counts?: { indicators: number }
  sample?: any[]
  message?: string
}

async function fetchComprehensive(): Promise<CompData> {
  const token = process.env.INTERNAL_API_TOKEN!
  const h = new Headers()
  h.set('x-internal-api-token', token)

  const host =
    headers().get('x-forwarded-host') ??
    headers().get('host') ??
    process.env.VERCEL_URL ??
    'localhost:3000'

  const res = await fetch(`https://${host}/comprehensive/api/list`, {
    method: 'GET',
    headers: h,
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    return { ok: false, message: `HTTP ${res.status}` }
  }
  return res.json()
}

export default async function ComprehensivePage() {
  const data = await fetchComprehensive()

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Comprehensive Framework (read-only)</h1>
      {!data.ok ? (
        <>
          <p className="mt-4 text-red-600">Failed to load comprehensive framework data.</p>
          {data.message && <p className="mt-2 text-sm text-gray-600">{data.message}</p>}
          <p className="mt-4 text-sm text-gray-500">
            You can also inspect the raw endpoint at <code>/comprehensive/api/list</code>.
          </p>
        </>
      ) : (
        <>
          <ul className="mt-4 list-disc pl-5 space-y-1">
            <li>Indicators: {data.counts?.indicators ?? 0}</li>
          </ul>

          <h2 className="mt-8 text-lg font-semibold">Sample rows</h2>
          <pre className="mt-2 rounded bg-gray-100 p-4 text-sm overflow-auto">
            {JSON.stringify(data.sample?.[0] ?? {}, null, 2)}
          </pre>

          <p className="mt-6 text-sm text-gray-500">
            Data is fetched from <code>/comprehensive/api/list</code> using a server-injected secret
            header. Once these counts/samples look correct, we’ll layer in the full UI.
          </p>
        </>
      )}
    </div>
  )
}
