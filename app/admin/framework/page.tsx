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
      <p className="text-sm text-gray-600 mb-4">Define pillars, themes, and sub-themes. Countries inherit these and may adapt as needed.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Stat label="Pillars" value={data.counts.pillars} href="/admin/framework/pillars" />
        <Stat label="Themes" value={data.counts.themes} href="/admin/framework/themes" />
        <Stat label="Sub-themes" value={data.counts.subthemes} href="/admin/framework/subthemes" />
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminCard
          title="Manage Pillars"
          desc="Create, rename, re-order and describe pillars."
          href="/admin/framework/pillars"
        />
        <AdminCard
          title="Manage Themes"
          desc="Attach themes to pillars; edit names, descriptions and order."
          href="/admin/framework/themes"
        />
        <AdminCard
          title="Manage Sub-themes"
          desc="Attach sub-themes to themes; edit details and order."
          href="/admin/framework/subthemes"
        />
        <AdminCard
          title="Versioning (coming soon)"
          desc="Save, compare and publish framework versions."
        />
      </section>
    </main>
  )
}

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <a href={href} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300">
      <div className="text-xs text-gray-600">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </a>
  )
}

function AdminCard({ title, desc, href }: { title: string; desc: string; href?: string }) {
  const content = (
    <div className="border border-gray-200 rounded-2xl p-5 h-full">
      <div className="text-lg font-semibold mb-1">{title}</div>
      <div className="text-sm text-gray-700">{desc}</div>
    </div>
  )
  return href ? <a href={href}>{content}</a> : content
}
