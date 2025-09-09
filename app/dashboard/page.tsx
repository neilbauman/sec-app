// app/dashboard/page.tsx
import Link from 'next/link'
import { getCurrentRole, roleLabel } from '@/lib/role'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const role = getCurrentRole()

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold">SSC Dashboard</h1>
      <p className="text-sm text-gray-600 mt-1">
        You are viewing as <span className="font-medium">{roleLabel(role)}</span>.{' '}
        <span className="ml-2">
          Quick switch:{' '}
          <Link className="underline" href="/_auth/set-role?role=public">Public</Link> ·{' '}
          <Link className="underline" href="/_auth/set-role?role=country-admin">Country Admin</Link> ·{' '}
          <Link className="underline" href="/_auth/set-role?role=super-admin">Super Admin</Link>
        </span>
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Link href="/admin/framework" className="rounded-xl border p-4 hover:bg-gray-50">
          <h3 className="font-semibold">Configure Global SSC Framework</h3>
          <p className="text-sm text-slate-600 mt-1">
            Define pillars, themes, and sub-themes—the master standard all countries inherit.
          </p>
        </Link>

        <div className="rounded-xl border p-4 opacity-80">
          <h3 className="font-semibold">Configure Country</h3>
          <p className="text-sm text-slate-600 mt-1">
            Set country baselines: admin units, P-codes, populations, boundaries.
          </p>
        </div>

        <div className="rounded-xl border p-4 opacity-80">
          <h3 className="font-semibold">SSC Instances</h3>
          <p className="text-sm text-slate-600 mt-1">
            Create and manage analysis runs that combine framework + country data.
          </p>
        </div>

        <Link href="/comprehensive" className="rounded-xl border p-4 hover:bg-gray-50">
          <h3 className="font-semibold">View SSC Calculations (Public)</h3>
          <p className="text-sm text-slate-600 mt-1">
            Explore maps and tables of SSC severity and People in Need.
          </p>
        </Link>

        <div className="rounded-xl border p-4 opacity-80">
          <h3 className="font-semibold">Data Sources</h3>
          <p className="text-sm text-slate-600 mt-1">
            Connect MSNA or other sources; map questions to indicators.
          </p>
        </div>

        <div className="rounded-xl border p-4 opacity-80">
          <h3 className="font-semibold">Admin & Access</h3>
          <p className="text-sm text-slate-600 mt-1">
            (Future) Manage users and permissions.
          </p>
        </div>
      </div>
    </main>
  )
}
