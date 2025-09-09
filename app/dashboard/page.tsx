import Link from 'next/link'
import { getCurrentRole, roleLabel } from '@/lib/role'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const role = await getCurrentRole()
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">SSC Dashboard</h1>
        <a className="text-sm underline" href="/auth/set-role?role=super-admin">Become Super Admin</a>
      </div>
      <p className="text-sm text-slate-600">You are <span className="font-medium">{roleLabel(role)}</span>.</p>

      <Link
  href="/auth/set-role?role=super-admin"
  className="text-blue-600 underline"
>
  Switch to Super Admin
</Link>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/admin/framework/primary/editor" className="rounded-xl border p-4 hover:bg-white bg-white">
          <div className="text-lg font-semibold">Primary Framework Editor</div>
          <div className="text-sm text-slate-600">Manage pillars, themes, and subthemes</div>
        </Link>
      </div>
    </main>
  )
}
