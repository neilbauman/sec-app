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
  message?: string
}

export const dynamic = 'force-dynamic'

export default async function PrimaryEditorPage() {
  // read role from cookie (server)
  const role = getCurrentRole()

  // fetch list (public right now; later you can re-enable auth gates on the API)
  const res = await internalGet('/framework/api/list')

  if (!res.ok) {
    const status = res.status
    const txt = (await safeText(res)) || res.statusText || 'Error'
    return (
      <main className="mx-auto max-w-6xl p-6">
        <a href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">← Back to Dashboard</a>
        <h1 className="mb-3 text-2xl font-bold">Primary Framework Editor</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          Could not load framework ({status}). {txt}
        </div>
      </main>
    )
  }

  const data = (await res.json()) as FrameworkList

  return (
    <main className="mx-auto max-w-6xl p-6">
      <a href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">← Back to Dashboard</a>
      <h1 className="mb-3 text-2xl font-bold">Primary Framework Editor</h1>

      <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-indigo-900">
        Tailwind check: this box should look purple with rounded corners.
      </div>

      <PrimaryFrameworkCards
        pillars={data.pillars}
        themes={data.themes}
        subthemes={data.subthemes}
      />
    </main>
  )
}

async function safeText(res: Response) {
  try {
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) {
      const j = await res.json().catch(() => null)
      if (j && typeof j.message === 'string') return j.message
      return JSON.stringify(j)
    }
    return await res.text()
  } catch {
    return null
  }
}
