// app/admin/framework/primary/editor/page.tsx

import PrimaryFrameworkCards from '../../../../components/PrimaryFrameworkCards'
import { internalGetJSON } from '../../../../lib/internalFetch'
import { getCurrentRole } from '../../../../lib/role'

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
  // Role is informational only right now (no gating until auth is ready)
  const role = await getCurrentRole().catch(() => 'public')

  // Fetch the framework list (publicly accessible route per our current setup)
  let data: FrameworkList | null = null
  let errorMsg: string | null = null
  try {
    data = await internalGetJSON<FrameworkList>('/framework/api/list')
  } catch (err: any) {
    errorMsg = err?.message || 'Failed to load framework list.'
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <a
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        ← Back to Dashboard
      </a>

      <div className="mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
          <p className="text-sm text-slate-600">
            Role: <span className="font-medium">{role}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/admin/framework/primary/export"
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
          >
            Export CSV
          </a>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {errorMsg}
        </div>
      )}

      {data && !data.ok && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          The API responded but reported not-ok. Please verify your framework data.
        </div>
      )}

      {data ? (
        <PrimaryFrameworkCards
          role={role}
          pillars={data.pillars}
          themes={data.themes}
          subthemes={data.subthemes}
        />
      ) : (
        !errorMsg && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Loading…
          </div>
        )
      )}
    </main>
  )
}
