// app/admin/framework/primary/editor/page.tsx
import { internalGet } from '@/lib/internalFetch'
import { getCurrentRole, AppRole } from '@/lib/role'
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
  const role: AppRole = getCurrentRole()

  let data: FrameworkList | null = null
  try {
    data = await internalGet<FrameworkList>('/framework/api/list')
  } catch (e: any) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <a href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">← Back to Dashboard</a>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          Could not load framework ({e?.message ?? 'error'}). Unauthorized
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <a href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">← Back to Dashboard</a>
      <h1 className="text-2xl font-bold mb-3">Primary Framework Editor</h1>

      <div className="rounded-lg border bg-indigo-50 text-indigo-900 border-indigo-200 p-3 mb-4">
        Tailwind check: this box should look purple with rounded corners.
      </div>

      <PrimaryFrameworkCards
        role={role}
        pillars={data.pillars}
        themes={data.themes}
        subthemes={data.subthemes}
      />

      <p className="text-xs text-slate-500 mt-6">
        Click the chevrons to expand. Actions and CSV import will come next.
      </p>
    </main>
  )
}
