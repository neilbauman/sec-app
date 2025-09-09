// app/admin/framework/page.tsx
import Link from 'next/link'
import { getCurrentRole, roleLabel } from '@/lib/role'

export const dynamic = 'force-dynamic'

export default function FrameworkIndex() {
  const role = getCurrentRole()
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Framework</h1>
      <p className="text-sm text-slate-600 mt-1">
        You are <span className="font-medium">{roleLabel(role)}</span>.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <Link href="/admin/framework/primary/editor" className="rounded-xl border p-4 hover:bg-gray-50">
          Primary Framework Editor
        </Link>
      </div>

      <p className="text-sm mt-4">
        Quick role switch:{' '}
        <a className="underline" href="/auth/set-role?role=super-admin">Super Admin</a>{' · '}
        <a className="underline" href="/auth/set-role?role=country-admin">Country Admin</a>{' · '}
        <a className="underline" href="/auth/set-role?role=public">Public</a>
      </p>
    </main>
  )
}
