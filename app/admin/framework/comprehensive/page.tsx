// app/admin/framework/comprehensive/page.tsx
import { getCurrentRole } from '@/lib/role'

export const dynamic = 'force-dynamic'

export default async function ComprehensiveFrameworkPage() {
  const role = await getCurrentRole()
  const isSuper = role === 'super-admin'
  if (!isSuper) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Comprehensive SSC Framework</h1>
        <div className="border rounded-xl p-4 bg-yellow-50 border-yellow-200 text-yellow-900">
          Super Admin access required.
        </div>
      </main>
    )
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Comprehensive SSC Framework</h1>
          <p className="text-sm text-gray-600">
            Indicators, levels, default scoring, mappings to data sources.
          </p>
        </div>
        <nav className="text-sm">
          <a className="underline" href="/admin/framework">Back to Framework Admin</a>
        </nav>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminCard
          title="Indicators (coming soon)"
          desc="Create indicator library and attach to sub-themes."
        />
        <AdminCard
          title="Levels & Criteria (coming soon)"
          desc="Define severity levels and textual criteria for each indicator."
        />
        <AdminCard
          title="Default Scoring (coming soon)"
          desc="Set default rules for aggregation and People-in-Need."
        />
        <AdminCard
          title="Data Source Mapping (coming soon)"
          desc="Map MSNA/government questions to indicators for automated scoring."
        />
      </section>
    </main>
  )
}

function AdminCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border border-gray-200 rounded-2xl p-5 h-full">
      <div className="text-lg font-semibold mb-1">{title}</div>
      <div className="text-sm text-gray-700">{desc}</div>
    </div>
  )
}
