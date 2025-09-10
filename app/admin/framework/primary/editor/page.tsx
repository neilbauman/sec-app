// /app/admin/framework/primary/editor/page.tsx
import Link from 'next/link'
import PrimaryFrameworkCards from '@/components/PrimaryFrameworkCards'
import { fetchFrameworkList } from '@/lib/framework'
import type { Pillar, Theme, Subtheme } from '@/types/framework'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const data = await fetchFrameworkList()
  const pillars = (data?.pillars ?? []) as Pillar[]
  const themes = (data?.themes ?? []) as Theme[]
  const subthemes = (data?.subthemes ?? []) as Subtheme[]

  return (
    <main className="mx-auto max-w-6xl p-6">
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        ← Back to Dashboard
      </Link>

      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
      </div>

      <div className="mt-6 rounded-lg border">
        <div className="grid grid-cols-[1fr_120px_120px] items-center gap-4 border-b bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
          <div>Name / Description</div>
          <div className="text-right pr-4">Sort Order</div>
          <div className="text-right pr-2">Actions</div>
        </div>

        <PrimaryFrameworkCards
          defaultOpen={false}
          pillars={pillars}
          themes={themes}
          subthemes={subthemes}
        />
      </div>
    </main>
  )
}
