// app/admin/framework/primary/editor/page.tsx
import { internalGet } from '../../../../lib/internalFetch'
import { getCurrentRole } from '../../../../lib/role'
import PrimaryFrameworkCards from '../../../../components/PrimaryFrameworkCards'

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
  const role = getCurrentRole() // synchronous (see lib/role.ts)

  // Public list endpoint while we iterate UI
  let data: FrameworkList | null = null
  try {
    data = await internalGet<FrameworkList>('/framework/api/list')
  } catch (e: any) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <a
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Dashboard
        </a>
        <h1 className="text-2xl font-bold mb-2">Primary Framework Editor</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-900">
          Failed to fetch framework list: {String(e?.message || e)}
        </div>
      </main>
    )
  }

  if (!data?.ok) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <a
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Dashboard
        </a>
        <h1 className="text-2xl font-bold mb-2">Primary Framework Editor</h1>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
          The list endpoint returned an error.
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <a
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        ← Back to Dashboard
      </a>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
        <a className="underline text-sm" href="/auth/set-role?role=super-admin&redirect=/admin/framework/primary/editor">
          Switch to Super Admin
        </a>
      </div>

      <p className="text-sm text-slate-600">
        Pillars, Themes, and Subthemes (read-only for now; actions come next).
      </p>

      <div className="mt-6">
        <PrimaryFrameworkCards
          role={role}
          pillars={data.pillars}
          themes={data.themes}
          subthemes={data.subthemes}
        />
      </div>
    </main>
  )
}
