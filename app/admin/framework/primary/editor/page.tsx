// app/admin/framework/primary/editor/page.tsx
import { internalGet } from '@/lib/internalFetch'
import { getCurrentRole } from '@/lib/role'

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
  const isSuper = role === 'super-admin'
  if (!isSuper) {
    return (
      <main className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Primary SSC Framework — Editor</h1>
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

  // group themes by pillar, subthemes by theme
  const themesByPillar = new Map<string, Theme[]>()
  data.themes.forEach((t) => {
    const arr = themesByPillar.get(t.pillar_code) ?? []
    arr.push(t)
    themesByPillar.set(t.pillar_code, arr)
  })
  const subsByTheme = new Map<string, Subtheme[]>()
  data.subthemes.forEach((s) => {
    const arr = subsByTheme.get(s.theme_code) ?? []
    arr.push(s)
    subsByTheme.set(s.theme_code, arr)
  })

  return (
    <main className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">Primary SSC Framework — Editor</h1>
          <p className="text-sm text-gray-600">
            Read-only for now. Next step adds Edit / Delete / Move / Add Child and CSV Import.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/dashboard"
            className="px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300"
          >
            ← Back to Dashboard
          </a>
          <a
            href="/admin/framework/primary"
            className="px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300"
          >
            Framework Admin
          </a>
          <a
            href="/admin/framework/primary/export"
            className="px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300"
          >
            ⭳ Export CSV
          </a>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <Legend color="bg-blue-500" label="Pillar" />
        <Legend color="bg-green-500" label="Theme" />
        <Legend color="bg-red-500" label="Subtheme" />
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[140px_1fr_2fr_110px_140px] gap-2 text-xs font-medium text-gray-600 border-b border-gray-200 pb-2 mb-2">
        <div>Level</div>
        <div>Code & Name</div>
        <div>Description</div>
        <div className="text-right">Sort</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {data.pillars
          .slice()
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((p) => (
            <div key={p.code} className="space-y-2">
              <Row
                level="pillar"
                code={p.code}
                name={p.name}
                description={p.description}
                sort={p.sort_order}
              />
              {(themesByPillar.get(p.code) ?? [])
                .slice()
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((t) => (
                  <div key={t.code} className="space-y-2 pl-6">
                    <Row
                      level="theme"
                      code={t.code}
                      name={t.name}
                      description={t.description}
                      sort={t.sort_order}
                    />
                    {(subsByTheme.get(t.code) ?? [])
                      .slice()
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((s) => (
                        <div key={s.code} className="pl-6">
                          <Row
                            level="subtheme"
                            code={s.code}
                            name={s.name}
                            description={s.description}
                            sort={s.sort_order}
                          />
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-500 mt-6">
        Actions are disabled in this read-only version. Next step will enable Edit, Delete (cascade),
        Move Up/Down, Add child, plus CSV Import.
      </p>
    </main>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`inline-block w-3 h-3 rounded ${color}`} />
      <span>{label}</span>
    </span>
  )
}

function Row(props: {
  level: 'pillar' | 'theme' | 'subtheme'
  code: string
  name: string
  description?: string
  sort: number
}) {
  const { level, code, name, description, sort } = props
  const tagColor =
    level === 'pillar' ? 'bg-blue-500' : level === 'theme' ? 'bg-green-500' : 'bg-red-500'

  return (
    <div className="grid grid-cols-[140px_1fr_2fr_110px_140px] gap-2 items-start border border-gray-200 rounded-xl p-3">
      {/* Level tag */}
      <div className="flex items-center gap-2">
        <span className={`inline-block w-10 h-6 rounded ${tagColor}`} title={level} />
        <span className="capitalize text-sm">{level}</span>
      </div>

      {/* Code & Name */}
      <div>
        <div className="text-sm font-medium">
          <span className="text-gray-400 mr-2">[{code}]</span>
          {name}
        </div>
      </div>

      {/* Description */}
      <div className="text-sm text-gray-700 whitespace-pre-wrap">
        {description || <span className="text-gray-400 italic">—</span>}
      </div>

      {/* Sort */}
      <div className="text-sm text-right tabular-nums">{sort}</div>

      {/* Actions (disabled for now) */}
      <div className="flex justify-end gap-2">
        <button className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-400" disabled>
          Edit
        </button>
        <button className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-400" disabled>
          Delete
        </button>
        <button className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-400" disabled>
          ↑
        </button>
        <button className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-400" disabled>
          ↓
        </button>
        <button className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-400" disabled>
          + Child
        </button>
      </div>
    </div>
  )
}
