// app/admin/framework/primary/editor/page.tsx
import { internalGet } from '@/lib/internalFetch'
import { getCurrentRole } from '@/lib/role'
import PrimaryEditorTable from '@/components/PrimaryEditorTable'

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
  if (role !== 'super-admin') {
    return (
      <main className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Primary Framework Editor</h1>
        <div className="border rounded-xl p-4 bg-yellow-50 border-yellow-200 text-yellow-900">
          Super Admin access required.
        </div>
        <div className="mt-4">
          <a className="underline" href="/dashboard">Back to Dashboard</a>
        </div>
      </main>
    )
  }

  const data = await internalGet<FrameworkList>('/framework/api/list')

  const themesByPillar = new Map<string, Theme[]>()
  data.themes.forEach((t) => {
    const arr = themesByPillar.get(t.pillar_code) ?? []
    arr.push(t)
    themesByPillar.set(t.pillar_code, arr)
  })
  const subsByTheme = new Map<string, Subtheme[]>()
  data.subthemes.forEach((s) => {
    const arr = subsByTheme.get(s.theme_code) ?? []
    arr.push(s)
    subsByTheme.set(s.theme_code, arr)
  })

  return (
    <main className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:border-gray-300"
        >
          ← Dashboard
        </a>

        <h1 className="text-xl sm:text-2xl font-bold ml-1">Primary Framework Editor</h1>

        <div className="ml-auto flex items-center gap-2">
          <a
            href="/admin/framework/primary/editor"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:border-gray-300"
            title="Refresh"
          >
            ⟳ Refresh
          </a>

          {/* Expand/Collapse hints (these toggle via localStorage keys) */}
          <button
            onClick={() => {
              localStorage.setItem('pe_openPillars', JSON.stringify({}))
              localStorage.setItem('pe_openThemes', JSON.stringify({}))
              location.reload()
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:border-gray-300"
            title="Collapse all"
          >
            ▸ Collapse all
          </button>
          <button
            onClick={() => {
              // open all: set every pillar/theme to true
              const p: Record<string, boolean> = {}
              const t: Record<string, boolean> = {}
              for (const pl of data.pillars) p[pl.code] = true
              for (const th of data.themes) t[th.code] = true
              localStorage.setItem('pe_openPillars', JSON.stringify(p))
              localStorage.setItem('pe_openThemes', JSON.stringify(t))
              location.reload()
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:border-gray-300"
            title="Expand all"
          >
            ▾ Expand all
          </button>

          <button
            disabled
            title="Import (coming soon)"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-400"
          >
            ⭡ Import CSV
          </button>
          <a
            href="/admin/framework/primary/export"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:border-gray-300"
            title="Export CSV"
          >
            ⭳ Export CSV
          </a>
          <button
            disabled
            title="New Pillar (coming soon)"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-3 py-2 opacity-60"
          >
            + New Pillar
          </button>
        </div>
      </div>

      <PrimaryEditorTable
        pillars={data.pillars}
        themesByPillar={themesByPillar}
        subsByTheme={subsByTheme}
      />

      <p className="text-xs text-gray-500 mt-3">
        Use ▸/▾ to expand rows. Actions are disabled in this read-only version.
      </p>
    </main>
  )
}
