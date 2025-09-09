// app/admin/framework/primary/editor/page.tsx
import { getCurrentRole } from '@/lib/role'
import { internalGet } from '@/lib/internalFetch'
import PrimaryFrameworkCards from '@/components/PrimaryFrameworkCards'

type Pillar = { code: string; name: string; description?: string; sort_order: number }
type Theme = { code: string; pillar_code: string; name: string; description?: string; sort_order: number }
type Subtheme = { code: string; theme_code: string; name: string; description?: string; sort_order: number }
type FrameworkList = {
  ok: boolean
  counts: { pillars: number; themes: number; subthemes: number }
  pillars: Pillar[]
  themes: Theme[]
  subthemes: Subtheme[]
}

export const dynamic = 'force-dynamic'

export default async function PrimaryEditorPage() {
  const role = await getCurrentRole()

  // fetch list (publicly accessible for now)
  const res = await internalGet('/framework/api/list')
  if (!res.ok) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <a href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">← Back to Dashboard</a>
        <h1 className="mb-2 text-2xl font-bold">Primary Framework Editor</h1>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900">
          Failed to load framework list. Please try again. (status {res.status})
        </div>
      </main>
    )
  }

  const data = (await res.json()) as FrameworkList

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <a href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">← Back to Dashboard</a>
        <div className="text-xs text-slate-500">
          Pillars: {data.counts.pillars} · Themes: {data.counts.themes} · Sub-themes: {data.counts.subthemes}
        </div>
      </div>

      <h1 className="mb-1 text-2xl font-bold">Primary Framework (read-only)</h1>
      <p className="mb-6 text-slate-600">
        Browse the current global framework. Editing actions will be added after we finish the read-only pass.
      </p>

      <PrimaryFrameworkCards
        role={role}
        pillars={data.pillars}
        themes={data.themes}
        subthemes={data.subthemes}
      />
    </main>
  )
}
