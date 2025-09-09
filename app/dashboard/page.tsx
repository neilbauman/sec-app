// app/dashboard/page.tsx
import Link from 'next/link'
import { getCurrentRole, roleLabel } from '@/lib/role'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const role = await getCurrentRole()

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">SSC Dashboard</h1>
        <p className="text-sm text-gray-600">
          You are viewing as <span className="font-medium">{roleLabel(role)}</span>.{' '}
          <span className="ml-2">
            Quick switch:{' '}
            <Link className="underline" href="/auth/set-role?role=public">Public</Link> ·{' '}
            <Link className="underline" href="/auth/set-role?role=country-admin">Country Admin</Link> ·{' '}
            <Link className="underline" href="/auth/set-role?role=super-admin">Super Admin</Link>
          </span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/framework"
          className="rounded-xl border p-4 hover:shadow-sm transition"
        >
          <div className="font-semibold mb-1">Framework Admin</div>
          <div className="text-sm text-gray-600">
            Manage the Primary & Comprehensive SSC frameworks.
          </div>
        </Link>
      </div>
    </main>
  )
}
