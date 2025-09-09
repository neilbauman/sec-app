// app/admin/framework/primary/page.tsx
import { getCurrentRole } from '@/lib/role'
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

export default async function PrimaryFrameworkPage() {
  const role = await getCurrentRole()
  const isSuper = role === 'super-admin'
  if (!isSuper) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Primary SSC Framework</h1>
        <div className="border rounded-xl p-4 bg-yellow-50 border-yellow-200 text-yellow-900">
          Super Admin access required.
        </div>
      </main>
    )
  }

  const data = await internalGet<FrameworkList>('/framework/api/list')

  // groupings
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
    <main className="p-6 max-w-5xl mx-auto">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Primary SSC Framework</h1>
          <p className="text-sm text-gray-600">Pillars → Themes → Sub-themes (global defaults)</p>
        </div>
        <nav className="text-sm">
          <a className="underline" href="/admin/framework">Back to Framework Admin</a>
        </nav>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Stat label="Pillars" value={data.counts.pillars} />
        <Stat label="Themes" value={data.counts.themes} />
        <Stat label="Sub-themes" value={data.counts.subthemes} />
      </div>

      {/* Read-only tree for now; next step we'll add CRUD */}
      {data.pillars
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((p) => (
          <article key={p.code} className="border border-gray-200 rounded-xl p-4 mb-4">
            <h2 className="text-lg font-semibold">{p.code} — {p.name}</h2>
            {p.description && <p className="text-gray-600 mt-1">{p.description}</p>}

            {(themesByPillar.get(p.code) ?? [])
              .slice()
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((t) => (
                <div key={t.code} className="border-l-4 border-gray-300 pl-3 mt-3">
                  <h3 className="font-medium">{t.code} — {t.name}</h3>
                  {t.description && <p className="text-gray-600 mt-1">{t.description}</p>}

                  <ul className="list-disc pl-5 mt-2">
                    {(subsByTheme.get(t.code) ?? [])
                      .slice()
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((s) => (
                        <li key={s.code} className="mb-1">
                          <strong>{s.code}</strong> — {s.name}
                          {s.description ? <span className="text-gray-600"> — {s.description}</span> : null}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </article>
        ))}
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="text-xs text-gray-600">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}
