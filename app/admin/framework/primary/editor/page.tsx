import Link from 'next/link'
import PrimaryFrameworkCards from '@/components/PrimaryFrameworkCards'
import { fetchFrameworkList } from '@/lib/framework'
import type { Pillar, Theme, Subtheme } from '@/types/framework'

// import server actions (do NOT export them from this file)
import {
  actionUpdateName,
  actionUpdateDescription,
  actionReorder,
  actionImportCsv,
  actionExportCsv,
} from './actions'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const data = await fetchFrameworkList()

  const pillars = (data?.pillars ?? []) as Pillar[]
  const themes = (data?.themes ?? []) as Theme[]
  const subthemes = (data?.subthemes ?? []) as Subtheme[]

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="mb-2 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
          <p className="text-sm text-slate-600">
            Manage pillars, themes, and subthemes. (CSV buttons are placeholders.)
          </p>
        </div>

        {/* CSV placeholders (not wired yet) */}
        <div className="flex items-center gap-2">
          <form action={actionImportCsv}>
            <input
              type="file"
              name="csv"
              accept=".csv"
              className="hidden"
              id="pf-import-csv"
              // NOTE: still placeholder; no client JS needed yet
            />
            <button
              type="submit"
              disabled
              title="Coming soon"
              className="rounded-md border px-3 py-1.5 text-sm text-slate-600 opacity-60"
            >
              Import CSV
            </button>
          </form>

          <form action={actionExportCsv}>
            <button
              type="submit"
              disabled
              title="Coming soon"
              className="rounded-md border px-3 py-1.5 text-sm text-slate-600 opacity-60"
            >
              Export CSV
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6">
        <PrimaryFrameworkCards
          defaultOpen={false}
          pillars={pillars}
          themes={themes}
          subthemes={subthemes}
          // pass server actions down; page itself exports nothing else
          onUpdateName={actionUpdateName}
          onUpdateDescription={actionUpdateDescription}
          onReorder={actionReorder}
        />
      </div>
    </main>
  )
}
