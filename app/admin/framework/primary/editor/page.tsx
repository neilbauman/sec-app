// app/admin/framework/primary/editor/page.tsx
import { internalGet } from '@/lib/internalFetch'
import { getCurrentRole } from '@/lib/role'
import PrimaryEditorTable from '@/components/PrimaryEditorTable'

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
  if (role !== 'super-admin') {
    return (
      <main className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Primary Framework Editor</h1>
        <div className="border rounded-xl p-4 bg-yellow-50 border-yellow-200 text-yellow-900">
          Super Admin access required.
        </div>
        <div className="mt-4">
          <a className="underline" href="/dashboard">Back to Dashboard</a>
        </div>
      </main>
    )
  }

  const data = await internalGet<FrameworkList>('/framework/api/list')

  return (
    <main className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:border-gray-300"
        >
          ← Dashboard
        </a>

        <h1 className="text-xl sm:text-2xl font-bold ml-1">Primary Framework Editor</h1>

        <div className="ml-auto flex items-center gap-2">
          <a
            href="/admin/framework/primary/editor"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:border-gray-300"
            title="Refresh"
          >
            ⟳ Refresh
          </a>

          <button
            onClick={() => {
              // collapse all via localStorage
              // (no-op on server; runs in browser after hydration)
            }}
            disabled
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-400"
            title="Collapse all (available after load)"
          >
            ▸ Collapse all
          </button>
          <button
            disabled
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-400"
            title="Expand all (available after load)"
          >
            ▾ Expand all
          </button>

          <button
            disabled
            title="Import (coming soon)"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-400"
          >
            ⭡ Import CSV
          </button>
          <a
            href="/admin/framework/primary/export"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:border-gray-300"
            title="Export CSV"
          >
            ⭳ Export CSV
          </a>
          <button
            disabled
            title="New Pillar (coming soon)"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-3 py-2 opacity-60"
          >
            + New Pillar
          </button>
        </div>
      </div>

      {/* Pass JSON-safe arrays; client builds Maps */}
      <PrimaryEditorTable
        pillars={data.pillars}
        themes={data.themes}
        subthemes={data.subthemes}
      />

      <p className="text-xs text-gray-500 mt-3">
        Use ▸/▾ to expand rows. Actions are disabled in this read-only version.
      </p>

      {/* Small script to wire Expand/Collapse all after hydration */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('pageshow', function() {
              var collapse = document.querySelector('[title="Collapse all (available after load)"]');
              var expand = document.querySelector('[title="Expand all (available after load)"]');
              if (collapse) {
                collapse.removeAttribute('disabled');
                collapse.addEventListener('click', function() {
                  localStorage.setItem('pe_openPillars', JSON.stringify({}));
                  localStorage.setItem('pe_openThemes', JSON.stringify({}));
                  location.reload();
                });
              }
              if (expand) {
                expand.removeAttribute('disabled');
                expand.addEventListener('click', function() {
                  try {
                    var p = {}; var t = {};
                    ${JSON.stringify(data.pillars)}.forEach(pl => p[pl.code] = true);
                    ${JSON.stringify(data.themes)}.forEach(th => t[th.code] = true);
                    localStorage.setItem('pe_openPillars', JSON.stringify(p));
                    localStorage.setItem('pe_openThemes', JSON.stringify(t));
                    location.reload();
                  } catch {}
                });
              }
            });
          `,
        }}
      />
    </main>
  )
}
