// app/dashboard/page.tsx
import Link from 'next/link'
import { getCurrentRole, roleLabel } from '@/lib/role'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const role = await getCurrentRole()

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold">SSC Dashboard</h1>
      <p className="text-sm text-gray-600 mt-2">
        You are viewing as <span className="font-medium">{roleLabel(role)}</span>.{' '}
        <span className="ml-2">
          Quick switch:{' '}
          <Link className="underline" href="/auth/set-role?role=public">Public</Link> ·{' '}
          <Link className="underline" href="/auth/set-role?role=country-admin">Country Admin</Link> ·{' '}
          <Link className="underline" href="/auth/set-role?role=super-admin">Super Admin</Link>
        </span>
      </p>

      <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/framework" className="block rounded-xl border p-5 hover:bg-gray-50">
          <h2 className="font-semibold">Configure Global SSC Framework</h2>
          <p className="text-sm text-gray-600 mt-2">
            Define pillars, themes, and sub-themes — the master standard all countries inherit.
          </p>
        </Link>

        <Link href="#" className="block rounded-xl border p-5 hover:bg-gray-50">
          <h2 className="font-semibold">Configure Country</h2>
          <p className="text-sm text-gray-600 mt-2">
            Set country baselines: admin units, P-codes, populations, boundaries.
          </p>
        </Link>

        <Link href="#" className="block rounded-xl border p-5 hover:bg-gray-50">
          <h2 className="font-semibold">SSC Instances</h2>
          <p className="text-sm text-gray-600 mt-2">
            Create and manage analysis runs that combine framework + country data.
          </p>
        </Link>

        <Link href="#" className="block rounded-xl border p-5 hover:bg-gray-50">
          <h2 className="font-semibold">View SSC Calculations (Public)</h2>
          <p className="text-sm text-gray-600 mt-2">
            Explore maps and tables of SSC severity and People in Need.
          </p>
        </Link>

        <Link href="#" className="block rounded-xl border p-5 hover:bg-gray-50">
          <h2 className="font-semibold">Data Sources</h2>
          <p className="text-sm text-gray-600 mt-2">
            Connect MSNA or other sources; map questions to indicators.
          </p>
        </Link>

        <Link href="#" className="block rounded-xl border p-5 hover:bg-gray-50">
          <h2 className="font-semibold">Admin & Access</h2>
          <p className="text-sm text-gray-600 mt-2">
            (Future) Manage users and permissions.
          </p>
        </Link>
      </div>
    </main>
  )
}
