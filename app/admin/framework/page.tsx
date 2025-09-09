// app/admin/framework/page.tsx
import { getCurrentRole } from '@/lib/role'
import { internalGet } from '@/lib/internalFetch'

type Counts = { pillars: number; themes: number; subthemes: number }
type FrameworkList = { ok: boolean; counts: Counts }

export const dynamic = 'force-dynamic'

export default async function FrameworkAdminPage() {
  const role = await getCurrentRole()
  const isSuper = role === 'super-admin'
  if (!isSuper) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Global SSC Framework</h1>
        <div className="border rounded-xl p-4 bg-yellow-50 border-yellow-200 text-yellow-900">
          You need <strong>Super Admin</strong> to configure the global framework.
          Use the dashboard to switch role for now.
        </div>
      </main>
    )
  }

  const data = await internalGet<FrameworkList>('/framework/api/list')

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Global SSC Framework (Admin)</h1>
      <p className="text-sm text-gray-600 mb-4">
        Configure the primary structure (pillars, themes, sub-themes) and, separately, the comprehensive layer
        (indicators, levels, default scoring).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <a href="/admin/framework/primary" className="border border-gray-200 rounded-2xl p-5 hover:border-gray-300">
          <div className="text-lg font-semibold mb-1">Primary SSC Framework</div>
          <p className="text-sm text-gray-700 mb-3">
            Pillars, themes, sub-themes and their descriptions — the global structure countries inherit.
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Pillars" value={data.counts.pillars} />
            <Stat label="Themes" value={data.counts.themes} />
            <Stat label="Sub-themes" value={data.counts.subthemes} />
          </div>
        </a>

        <a href="/admin/framework/comprehensive" className="border border-gray-200 rounded-2xl p-5 hover:border-gray-300">
          <div className="text-lg font-semibold mb-1">Comprehensive SSC Framework</div>
          <p className="text-sm text-gray-700">
            Indicators, levels/severity definitions, default scoring, and mapping to data sources.
          </p>
          <div className="mt-3 text-sm text-gray-600">Indicators: soon • Levels: soon • Scoring: soon</div>
        </a>
      </div>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="text-xs text-gray-600">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}
