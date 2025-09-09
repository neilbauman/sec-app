// app/admin/framework/page.tsx
import Link from 'next/link'
import { internalGet } from '@/lib/internalFetch'
import { getCurrentRole, roleLabel } from '@/lib/role'

type FrameworkList = {
  ok: boolean
  counts: { pillars: number; themes: number; subthemes: number }
  pillars: any[]
  themes: any[]
  subthemes: any[]
}

export const dynamic = 'force-dynamic'

export default async function FrameworkHome() {
  const role = getCurrentRole()
  let data: FrameworkList | null = null
  try {
    data = await internalGet<FrameworkList>('/framework/api/list')
  } catch {
    data = null
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Framework</h1>
      <p className="text-sm text-slate-600 mt-1">You are <span className="font-medium">{roleLabel(role)}</span>.</p>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <Link href="/admin/framework/primary/editor" className="rounded-xl border p-4 hover:bg-gray-50">
          <h3 className="font-semibold">Primary Editor</h3>
          <p className="text-sm text-slate-600 mt-1">Edit pillars, themes, and sub-themes.</p>
        </Link>

        <Link href="/admin/framework/primary/export" className="rounded-xl border p-4 hover:bg-gray-50">
          <h3 className="font-semibold">Export CSV</h3>
          <p className="text-sm text-slate-600 mt-1">Download the primary framework tables.</p>
        </Link>
      </div>

      {data && (
        <p className="text-xs text-slate-500 mt-4">
          Counts – Pillars: {data.counts.pillars}, Themes: {data.counts.themes}, Subthemes: {data.counts.subthemes}
        </p>
      )}
    </main>
  )
}
