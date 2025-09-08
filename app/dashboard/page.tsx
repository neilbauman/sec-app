// app/dashboard/page.tsx
import DashTile from '@/components/DashTile'
import { getCurrentRole, roleLabel } from '@/lib/role'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const role = await getCurrentRole()
  const canSuper = role === 'super-admin'
  const canCountry = role === 'country-admin' || role === 'super-admin'

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">SSC Dashboard</h1>
        <p className="text-sm text-gray-600">
          You are viewing as <span className="font-medium">{roleLabel(role)}</span>.{' '}
          <span className="ml-2">
            Quick switch:{' '}
            <a className="underline" href="/_auth/set-role?role=public">Public</a> ·{' '}
            <a className="underline" href="/_auth/set-role?role=country-admin">Country Admin</a> ·{' '}
            <a className="underline" href="/_auth/set-role?role=super-admin">Super Admin</a>
          </span>
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashTile
          title="Configure Global SSC Framework"
          desc="Define pillars, themes, and sub-themes — the master standard all countries inherit."
          href="/admin/framework"
          disabled={!canSuper}
        />
        <DashTile
          title="Configure Country"
          desc="Set country baselines: admin units, P-codes, populations, boundaries."
          href="/admin/country"
          disabled={!canCountry}
        />
        <DashTile
          title="SSC Instances"
          desc="Create and manage analysis runs that combine framework + country data."
          href="/ssc/instances"
          disabled={!canCountry}
        />
        <DashTile
          title="View SSC Calculations (Public)"
          desc="Explore maps and tables of SSC severity and People in Need."
          href="/framework"
        />
        <DashTile
          title="Data Sources"
          desc="Connect MSNA or other sources; map questions to indicators."
          href="/data/sources"
          disabled={!canCountry}
        />
        <DashTile
          title="Admin & Access"
          desc="(Future) Manage users and permissions."
          disabled={!canSuper}
        />
      </section>
    </main>
  )
}
