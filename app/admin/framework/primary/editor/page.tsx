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
      <main className="mx-auto max-w-6xl p-6">
        <a href="/dashboard" className="inline-flex items-center gap-2 mb-4 text-sm text-slate-600 hover:text-slate-900">
          ← Dashboard
        </a>
        <h1 className="text-2xl font-semibold tracking-tight">Primary Framework Editor</h1>
        <p className="mt-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
          Super Admin access required.
        </p>
      </main>
    )
  }

  // ✅ internalGet returns a Response
  const res = (await internalGet('/framework/api/list')) as Response
  if (!res.ok) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <a href="/dashboard" className="inline-flex items-center gap-2 mb-4 text-sm text-slate-600 hover:text-slate-900">
          ← Dashboard
        </a>
        <h1 className="text-2xl font-semibold tracking-tight">Primary Framework Editor</h1>
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900">
          Could not load framework data.
        </p>
      </main>
    )
  }

  // ✅ Now parse JSON into our typed shape
  const data = (await res.json()) as FrameworkList

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <a href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          ← Dashboard
        </a>
        <div className="flex items-center gap-2">
          <a
            href="/admin/framework/primary/editor"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
          >
            ⟳ Refresh
          </a>
          <a
            href="/admin/framework/primary/export"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
          >
            ⬇︎ Export CSV
          </a>
        </div>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">Primary Framework Editor</h1>

      <div className="mt-6">
        <PrimaryFrameworkCards
          role={role}
          pillars={data.pillars}
          themes={data.themes}
          subthemes={data.subthemes}
        />
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Click the chevrons to expand. Actions are enabled for Super Admins but are placeholders (no data is changed yet).
      </p>
    </main>
  )
}
