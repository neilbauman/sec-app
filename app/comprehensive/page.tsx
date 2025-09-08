// app/comprehensive/page.tsx
import { internalGet } from '@/lib/internalFetch'

type Pillar = { code: string; name: string; description?: string; sort_order: number }
type Theme = { code: string; pillar_code: string; name: string; description?: string; sort_order: number }
type Subtheme = { code: string; theme_code: string; name: string; description?: string; sort_order: number }

type ApiOk = {
  ok: true
  counts?: { pillars: number; themes: number; subthemes: number }
  pillars?: Pillar[]
  themes?: Theme[]
  subthemes?: Subtheme[]
}

type ApiErr = { ok: false; status?: number; message?: string }

export const dynamic = 'force-dynamic'

export default async function ComprehensivePage() {
  // 👇 Tell internalGet what shape we expect
  const res = await internalGet<ApiOk | ApiErr>('/comprehensive/api/list')

  if (!res.ok) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Comprehensive Framework (read-only)</h1>
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
          <div className="font-medium mb-1">Failed to load data</div>
          <div>Status: {('status' in res && res.status) || 500}</div>
          <div>Message: {('message' in res && res.message) || 'Unknown error'}</div>
        </div>
      </div>
    )
  }

  const counts = res.counts ?? { pillars: 0, themes: 0, subthemes: 0 }
  const pillars = (res.pillars ?? []).slice().sort((a, b) => a.sort_order - b.sort_order)
  const themes = (res.themes ?? []).slice().sort((a, b) => a.sort_order - b.sort_order)
  const subthemes = (res.subthemes ?? []).slice().sort((a, b) => a.sort_order - b.sort_order)

  // groupings
  const themesByPillar = new Map<string, typeof themes>()
  themes.forEach((t) => {
    const arr = themesByPillar.get(t.pillar_code) ?? []
    arr.push(t)
    themesByPillar.set(t.pillar_code, arr)
  })
  const subsByTheme = new Map<string, typeof subthemes>()
  subthemes.forEach((s) => {
    const arr = subsByTheme.get(s.theme_code) ?? []
    arr.push(s)
    subsByTheme.set(s.theme_code, arr)
  })

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Comprehensive Framework (read-only)</h1>
      <p className="text-sm text-gray-600 mb-4">Source: <code>/comprehensive/api/list</code></p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Stat label="Pillars" value={counts.pillars} />
        <Stat label="Themes" value={counts.themes} />
        <Stat label="Subthemes" value={counts.subthemes} />
      </div>

      {pillars.map((p) => (
        <article key={p.code} className="border border-gray-200 rounded-xl p-4 mb-4">
          <h2 className="text-lg font-semibold">{p.code} — {p.name}</h2>
          {p.description && <p className="text-gray-600 mt-1">{p.description}</p>}

          {(themesByPillar.get(p.code) ?? []).map((t) => (
            <div key={t.code} className="border-l-4 border-gray-300 pl-3 mt-3">
              <h3 className="font-medium">{t.code} — {t.name}</h3>
              {t.description && <p className="text-gray-600 mt-1">{t.description}</p>}

              <ul className="list-disc pl-5 mt-2">
                {(subsByTheme.get(t.code) ?? []).map((s) => (
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
