import { getCurrentRole } from '@/lib/role'
import { internalGet } from '@/lib/internalFetch'
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
  const data = await internalGet<FrameworkList>('/framework/api/list')

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-4">
      <div>
        <a href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">← Back to Dashboard</a>
        <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
        <p className="text-sm text-slate-600 mt-1">Super-admin actions are disabled for now; focusing on stable UI.</p>
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
