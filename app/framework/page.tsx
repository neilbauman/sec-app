// app/framework/page.tsx
import { internalGet } from '@/lib/internalFetch'

type Pillar = { code: string; name: string; description: string; sort_order: number }
type Theme = { code: string; pillar_code: string; name: string; description: string; sort_order: number }
type Subtheme = { code: string; theme_code: string; name: string; description: string; sort_order: number }
type FrameworkList = {
  ok: boolean
  counts: { pillars: number; themes: number; subthemes: number }
  pillars: Pillar[]
  themes: Theme[]
  subthemes: Subtheme[]
}

export const dynamic = 'force-dynamic'

export default async function FrameworkPage() {
  const data = await internalGet<FrameworkList>('/framework/api/list')

  // group themes by pillar, subthemes by theme
  const themesByPillar = new Map<string, Theme[]>()
  for (const t of data.themes) {
    const arr = themesByPillar.get(t.pillar_code) ?? []
    arr.push(t)
    themesByPillar.set(t.pillar_code, arr)
  }
  const subsByTheme = new Map<string, Subtheme[]>()
  for (const s of data.subthemes) {
    const arr = subsByTheme.get(s.theme_code) ?? []
    arr.push(s)
    subsByTheme.set(s.theme_code, arr)
  }

  return (
    <main style={{ padding: '24px', maxWidth: 1000, margin: '0 auto', lineHeight: 1.45 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Shelter Severity Framework</h1>
      <p style={{ marginBottom: 16, color: '#444' }}>
        Loaded from <code>/framework/api/list</code>
      </p>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <Stat label="Pillars" value={data.counts.pillars} />
        <Stat label="Themes" value={data.counts.themes} />
        <Stat label="Subthemes" value={data.counts.subthemes} />
      </section>

      {data.pillars
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((p) => (
          <article key={p.code} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, margin: 0 }}>
              {p.code} — {p.name}
            </h2>
            {p.description && <p style={{ marginTop: 6, color: '#555' }}>{p.description}</p>}

            {(themesByPillar.get(p.code) ?? [])
              .slice()
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((t) => (
                <div
                  key={t.code}
                  style={{
                    borderLeft: '4px solid #d1d5db',
                    paddingLeft: 12,
                    marginTop: 12,
                    marginBottom: 8,
                  }}
                >
                  <h3 style={{ fontSize: 16, margin: 0 }}>
                    {t.code} — {t.name}
                  </h3>
                  {t.description && <p style={{ marginTop: 4, color: '#555' }}>{t.description}</p>}

                  <ul style={{ marginTop: 6, paddingLeft: 16 }}>
                    {(subsByTheme.get(t.code) ?? [])
                      .slice()
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((s) => (
                        <li key={s.code} style={{ marginBottom: 4 }}>
                          <strong>{s.code}</strong> — {s.name}
                          {s.description ? <span style={{ color: '#555' }}> — {s.description}</span> : null}
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
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 14 }}>
      <div style={{ fontSize: 12, color: '#666' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
    </div>
  )
}
