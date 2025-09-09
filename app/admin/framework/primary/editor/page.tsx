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

  // prepare groupings for the client component
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
      <div className="flex items-center gap-2 mb-4">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:border-gray-300"
        >
          ← Dashboard
        </a>

        <div className="ml-auto flex items-center gap-2">
          <a
            href="/admin/framework/primary/editor"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:border-gray-300"
          >
            ⟳ Refresh
          </a>
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

      <h1 className="text-2xl font-bold mb-3">Primary Framework Editor</h1>

      <PrimaryEditorTable
        pillars={data.pillars}
        themesByPillar={themesByPillar}
        subsByTheme={subsByTheme}
      />

      <p className="text-xs text-gray-500 mt-3">
        Click the ▸/▾ caret to expand/collapse groups. Actions are disabled in this read-only version.
      </p>
    </main>
  )
}
