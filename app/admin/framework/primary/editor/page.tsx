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
  const role = await getCurrentRole()
  if (role !== 'super-admin') {
    return (
      <main className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Primary Framework Editor</h1>
        <div className="border rounded-xl p-4 bg-yellow-50 border-yellow-200 text-yellow-900">
          Super Admin access required.
        </div>
        <div className="mt-4"><a className="underline" href="/dashboard">Back to Dashboard</a></div>
      </main>
    )
  }

  const data = await internalGet<FrameworkList>('/framework/api/list')

  return (
    <main className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <a href="/dashboard" className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:border-gray-300">
          ← Dashboard
        </a>
        <h1 className="text-xl sm:text-2xl font-bold ml-1">Primary Framework Editor</h1>
        <div className="ml-auto flex items-center gap-2">
          <a href="/admin/framework/primary/editor" className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:border-gray-300" title="Refresh">⟳ Refresh</a>
          <a href="/admin/framework/primary/export" className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:border-gray-300" title="Export CSV">⭳ Export CSV</a>
        </div>
      </div>

      {/* Cards */}
      <PrimaryFrameworkCards
        pillars={data.pillars}
        themes={data.themes}
        subthemes={data.subthemes}
      />

      <p className="text-xs text-gray-500 mt-4">
        Click the chevrons to expand. Actions and CSV import will come next.
      </p>
    </main>
  )
}
