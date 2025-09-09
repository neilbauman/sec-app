import Link from 'next/link'
import { getCurrentRole, roleLabel } from '@/lib/role'
import { internalGet } from '@/lib/internalFetch'

type Pillar = { code: string; name: string; description?: string; sort_order: number }
type Theme = { code: string; pillar_code: string; name: string; description?: string; sort_order: number }
type Subtheme = { code: string; theme_code: string; name: string; description?: string; sort_order: number }
type FrameworkList = {
  ok: boolean
  counts: { pillars: number; themes: number; subthemes: number }
  pillars: Pillar[]
  themes: Theme[]
  subthemes: Subtheme[]
}

export const dynamic = 'force-dynamic'

export default async function FrameworkHome() {
  const role = await getCurrentRole()
  const data = await internalGet<FrameworkList>('/framework/api/list')

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Framework</h1>
      <p className="text-sm text-slate-600 mt-1">You are <span className="font-medium">{roleLabel(role)}</span>.</p>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <Link href="/admin/framework/primary/editor" className="rounded-xl border p-4 hover:bg-white bg-white">
          <div className="text-lg font-semibold">Primary Framework Editor</div>
          <div className="text-sm text-slate-600">Pillars: {data.counts.pillars} · Themes: {data.counts.themes} · Subthemes: {data.counts.subthemes}</div>
        </Link>
      </div>
    </main>
  )
}
