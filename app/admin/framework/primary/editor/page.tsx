// app/admin/framework/primary/editor/page.tsx
import { internalGet } from '@/lib/internalFetch'
import { getCurrentRole } from '@/lib/role'
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
  const role = getCurrentRole() // sync, safe in RSC

  // Public fetch (we disabled auth on list while we build UI)
  const res = await internalGet('/framework/api/list')
  if (!res.ok) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <a href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          ← Back to Dashboard
        </a>
        <h1 className="mb-2 text-2xl font-bold">Primary Framework Editor</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          Could not load framework list (HTTP {res.status}). Try again from the Dashboard.
        </div>
      </main>
    )
  }

  const data = (await res.json()) as FrameworkList

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <a href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          ← Back to Dashboard
        </a>
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span>Total:</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5">Pillars {data.counts.pillars}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5">Themes {data.counts.themes}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5">Subthemes {data.counts.subthemes}</span>
        </div>
      </div>

      <h1 className="mb-3 text-2xl font-bold">Primary Framework (read-only)</h1>
      <p className="mb-6 text-sm text-slate-600">
        Expand items with the ► caret. Colored tags show the level (pillar/theme/subtheme). Actions will
        be added after we finish the read-only layout.
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
