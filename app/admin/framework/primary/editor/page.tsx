// app/admin/framework/primary/editor/page.tsx
import Link from 'next/link'
import { internalGet } from '../../../../lib/internalFetch';
import { getCurrentRole } from '../../../../lib/role';
import PrimaryFrameworkCards from '../../../../components/PrimaryFrameworkCards';

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

export default async function PrimaryEditorPage() {
  const role = await getCurrentRole()

  // Fetch list (public during dev)
  let data: FrameworkList | null = null
  try {
    const res = await internalGet('/framework/api/list')
    data = (await res.json()) as FrameworkList
  } catch {
    // keep null -> error UI below
  }

  if (!data?.ok) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <Link href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          ← Back to Dashboard
        </Link>
        <div className="rounded-xl border p-4 bg-amber-50 border-amber-200 text-amber-900">
          Couldn’t load framework list. If you recently migrated files, wait a moment and retry.
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
        <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900 underline">
          Back to Dashboard
        </Link>
      </div>

      <PrimaryFrameworkCards
        role={role}
        pillars={data.pillars}
        themes={data.themes}
        subthemes={data.subthemes}
      />
    </main>
  )
}
