// app/admin/framework/page.tsx
import Link from 'next/link'
import { internalGet } from '@/lib/internalFetch'
import { getCurrentRole } from '@/lib/role'

type Pillar = { code: string; name: string; description?: string; sort_order: number }
type Theme = { code: string; pillar_code: string; name: string; description?: string; sort_order: number }
type Subtheme = { code: string; theme_code: string; name: string; description?: string; sort_order: number }
type FrameworkList = {
  counts: { pillars: number; themes: number; subthemes: number }
  pillars: Pillar[]
  themes: Theme[]
  subthemes: Subtheme[]
}

export const dynamic = 'force-dynamic'

export default async function FrameworkHome() {
  const role = await getCurrentRole()

  // Fetch (public for now)
  let data: FrameworkList | null = null
  try {
    const res = await internalGet('/framework/api/list')
    if (!res.ok) throw new Error(`List failed: ${res.status}`)
    data = (await res.json()) as FrameworkList
  } catch {
    return (
      <main className="p-6 max-w-5xl mx-auto">
        <a href="/dashboard" className="inline-flex items-center gap-2 mb-4 text-sm text-slate-600 hover:text-slate-900">
          ← Back to Dashboard
        </a>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Could not load framework.
        </div>
      </main>
    )
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <a href="/dashboard" className="inline-flex items-center gap-2 mb-4 text-sm text-slate-600 hover:text-slate-900">
        ← Back to Dashboard
      </a>

      <h1 className="text-2xl font-bold">Global SSC Framework</h1>
      <p className="text-sm text-gray-600 mt-2">
        Role: <span className="font-medium">{role}</span>
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Pillars</div>
          <div className="text-2xl font-semibold">{data.counts.pillars}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Themes</div>
          <div className="text-2xl font-semibold">{data.counts.themes}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Sub-themes</div>
          <div className="text-2xl font-semibold">{data.counts.subthemes}</div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/admin/framework/primary/editor" className="rounded-lg border px-4 py-2 hover:bg-gray-50">
          Open Primary Framework Editor
        </Link>
        <Link href="/admin/framework/primary/export" className="rounded-lg border px-4 py-2 hover:bg-gray-50">
          Export CSV
        </Link>
      </div>
    </main>
  )
}
