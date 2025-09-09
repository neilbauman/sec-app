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

  // group
  const themesByPillar = new Map<string, Theme[]>()
  data.themes.forEach(t => {
    const arr = themesByPillar.get(t.pillar_code) ?? []
    arr.push(t)
    themesByPillar.set(t.pillar_code, arr)
  })
  const subsByTheme = new Map<string, Subtheme[]>()
  data.subthemes.forEach(s => {
    const arr = subsByTheme.get(s.theme_code) ?? []
    arr.push(s)
    subsByTheme.set(s.theme_code, arr)
  })

  return (
    <main className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center gap-2 mb-4">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:border-gray-300"
        >
          ← Dashboard
        </a>

        <div className="ml-auto flex items-center gap-2">
          <a
            href="/admin/framework/primary/editor"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:border-gray-300"
          >
            ⟳ Refresh
          </a>
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

      <h1 className="text-2xl font-bold mb-3">Primary Framework Editor</h1>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="px-4 py-3 text-left w-[200px]">Type / Code</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left w-[520px]">Description</th>
              <th className="px-4 py-3 text-right w-[80px]">Sort</th>
              <th className="px-4 py-3 text-right w-[120px]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.pillars
              .slice()
              .sort((a, b) => a.sort_order - b.sort_order)
              .map(p => (
                <FragmentRows
                  key={p.code}
                  pillar={p}
                  themes={(themesByPillar.get(p.code) ?? []).slice().sort((a, b) => a.sort_order - b.sort_order)}
                  subsByTheme={subsByTheme}
                />
              ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Read-only preview. Next step enables Edit / Delete (cascade) / Move Up/Down / Add child, and CSV Import.
      </p>
    </main>
  )
}

function Badge({ color, children }: { color: 'blue' | 'green' | 'red'; children: React.ReactNode }) {
  const styles =
    color === 'blue'
      ? 'bg-blue-100 text-blue-700 border-blue-200'
      : color === 'green'
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-red-100 text-red-700 border-red-200'
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${styles}`}>
      {children}
    </span>
  )
}

function CodeSmall({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] text-gray-500 ml-2">[{children}]</span>
}

function NameCell({
  level,
  code,
  name,
  indent = 0,
}: {
  level: 'pillar' | 'theme' | 'subtheme'
  code: string
  name: string
  indent?: number
}) {
  const label =
    level === 'pillar' ? <Badge color="blue">Pillar</Badge> : level === 'theme' ? <Badge color="green">Theme</Badge> : <Badge color="red">Subtheme</Badge>
  return (
    <div className="flex items-center">
      <div style={{ width: indent, flex: '0 0 auto' }} />
      <div className="flex items-center gap-2">
        {label}
        <CodeSmall>{code}</CodeSmall>
      </div>
    </div>
  )
}

function ActionsDisabled() {
  const btn = 'inline-flex items-center rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-400'
  return (
    <div className="flex justify-end gap-1">
      <button className={btn} disabled title="Edit (coming soon)">✎</button>
      <button className={btn} disabled title="Delete (coming soon)">🗑</button>
      <button className={btn} disabled title="Move up (coming soon)">↑</button>
      <button className={btn} disabled title="Move down (coming soon)">↓</button>
      <button className={btn} disabled title="Add child (coming soon)">＋</button>
    </div>
  )
}

function FragmentRows({
  pillar,
  themes,
  subsByTheme,
}: {
  pillar: Pillar
  themes: Theme[]
  subsByTheme: Map<string, Subtheme[]>
}) {
  return (
    <>
      {/* Pillar row */}
      <tr className="border-t border-gray-200">
        <td className="px-4 py-3 align-top">
          <NameCell level="pillar" code={pillar.code} name={pillar.name} />
        </td>
        <td className="px-4 py-3 align-top">
          <div className="font-medium">{pillar.name}</div>
        </td>
        <td className="px-4 py-3 align-top text-gray-700">{pillar.description}</td>
        <td className="px-4 py-3 align-top text-right tabular-nums">{pillar.sort_order}</td>
        <td className="px-4 py-3 align-top"><ActionsDisabled /></td>
      </tr>

      {/* Theme rows */}
      {themes.map(t => (
        <ThemeBlock key={t.code} theme={t} subs={(subsByTheme.get(t.code) ?? []).slice().sort((a, b) => a.sort_order - b.sort_order)} />
      ))}
    </>
  )
}

function ThemeBlock({ theme, subs }: { theme: Theme; subs: Subtheme[] }) {
  return (
    <>
      <tr className="border-t border-gray-200">
        <td className="px-4 py-3 align-top">
          <NameCell level="theme" code={theme.code} name={theme.name} indent={24} />
        </td>
        <td className="px-4 py-3 align-top">
          <div className="font-medium">{theme.name}</div>
        </td>
        <td className="px-4 py-3 align-top text-gray-700">{theme.description}</td>
        <td className="px-4 py-3 align-top text-right tabular-nums">{theme.sort_order}</td>
        <td className="px-4 py-3 align-top"><ActionsDisabled /></td>
      </tr>

      {/* Subthemes */}
      {subs.map(s => (
        <tr key={s.code} className="border-t border-gray-200">
          <td className="px-4 py-3 align-top">
            <NameCell level="subtheme" code={s.code} name={s.name} indent={48} />
          </td>
          <td className="px-4 py-3 align-top">
            <div className="font-medium">{s.name}</div>
          </td>
          <td className="px-4 py-3 align-top text-gray-700">{s.description}</td>
          <td className="px-4 py-3 align-top text-right tabular-nums">{s.sort_order}</td>
          <td className="px-4 py-3 align-top"><ActionsDisabled /></td>
        </tr>
      ))}
    </>
  )
}
