// app/admin/framework/page.tsx
import Link from 'next/link'
import { getCurrentRole, roleLabel } from '@/lib/role'

export const dynamic = 'force-dynamic'

export default async function FrameworkAdminPage() {
  const role = await getCurrentRole()

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Framework</h1>
      <p className="text-sm text-slate-600 mt-1">
        You are <span className="font-medium">{roleLabel(role)}</span>.
        {' '}
        Quick switch:{' '}
        <a className="underline" href="/_auth/set-role?role=public">Public</a>{' · '}
        <a className="underline" href="/_auth/set-role?role=country-admin">Country Admin</a>{' · '}
        <a className="underline" href="/_auth/set-role?role=super-admin">Super Admin</a>
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <Link href="/admin/framework/primary/editor" className="rounded-xl border p-4 hover:bg-gray-50">
          <h2 className="font-medium">Primary Framework Editor</h2>
          <p className="text-sm text-slate-600 mt-1">Manage pillars, themes, and subthemes.</p>
        </Link>
      </div>
    </main>
  )
}
