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
  // role from cookie (sync)
  const role = getCurrentRole()

  // fetch list (public endpoint)
  const res = await internalGet('/framework/api/list')
  if (!res.ok) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <a href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          ← Back to Dashboard
        </a>
        <div className="rounded-xl border bg-red-50 p-4 text-red-900 border-red-200">
          Error loading framework list: {res.status} {res.statusText}
        </div>
      </main>
    )
  }

  const data = (await res.json()) as FrameworkList

  return (
    <main className="mx-auto max-w-6xl p-6">
      <a href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        ← Back to Dashboard
      </a>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
        <p className="text-sm text-slate-600 mt-1">
          (Dev mode) You’re currently <span className="font-medium">{role}</span>. Use the dashboard quick links to switch.
        </p>
      </div>

      <PrimaryFrameworkCards
        role={role}
        pillars={data.pillars}
        themes={data.themes}
        subthemes={data.subthemes}
      />
    </main>
  )
}
