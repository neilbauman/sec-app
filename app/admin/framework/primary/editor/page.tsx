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
  status?: number
  message?: string
}

export const dynamic = 'force-dynamic'

export default async function PrimaryEditorPage() {
  const role = await getCurrentRole()

  // (Temporary) allow anyone to load until auth is fully wired.
  // If your /framework/api/list enforces role, we show a friendly error.
  let data: FrameworkList | null = null
  try {
    data = await internalGet<FrameworkList>('/framework/api/list')
  } catch (err: any) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <a href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          ← Back to Dashboard
        </a>
        <h1 className="text-2xl font-bold mb-3">Primary Framework Editor</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 p-4">
          Could not load framework. {String(err?.message || '')}
        </div>
      </main>
    )
  }

  if (!data?.ok) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <a href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          ← Back to Dashboard
        </a>
        <h1 className="text-2xl font-bold mb-3">Primary Framework Editor</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 p-4">
          Could not load framework{data?.status ? ` (${data.status})` : ''}. {data?.message || 'Unknown error.'}
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <a href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        ← Back to Dashboard
      </a>
      <h1 className="text-2xl font-bold mb-4">Primary Framework Editor</h1>

      <PrimaryFrameworkCards
        role={role}
        pillars={data.pillars}
        themes={data.themes}
        subthemes={data.subthemes}
      />
    </main>
  )
}
